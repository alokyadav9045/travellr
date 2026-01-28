const Trip = require('../models/Trip');
const logger = require('../utils/logger');

class SearchService {
  constructor() {
    this.useElasticsearch = false; // Can be enabled with Elasticsearch setup
  }

  /**
   * Search trips with MongoDB (enhanced)
   */
  async searchTrips(params) {
    const {
      q,
      category,
      location,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      minRating,
      tags,
      lat,
      lng,
      radius,
      sortBy = 'relevance',
      page = 1,
      limit = 12,
    } = params;

    const filter = { status: 'published', isActive: true };
    const sort = {};

    // Text search
    if (q) {
      filter.$text = { $search: q };
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Location filter
    if (location) {
      filter.$or = [
        { 'location.city': new RegExp(location, 'i') },
        { 'location.country': new RegExp(location, 'i') },
        { 'location.state': new RegExp(location, 'i') },
      ];
    }

    // Price range
    if (minPrice || maxPrice) {
      filter['price.amount'] = {};
      if (minPrice) filter['price.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) filter['price.amount'].$lte = parseFloat(maxPrice);
    }

    // Duration range
    if (minDuration || maxDuration) {
      filter['duration.days'] = {};
      if (minDuration) filter['duration.days'].$gte = parseInt(minDuration);
      if (maxDuration) filter['duration.days'].$lte = parseInt(maxDuration);
    }

    // Rating filter
    if (minRating) {
      filter['rating.average'] = { $gte: parseFloat(minRating) };
    }

    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }

    // Geo search
    if (lat && lng && radius) {
      filter['location.coordinates'] = {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lng), parseFloat(lat)],
            parseFloat(radius) / 6378.1, // Convert km to radians
          ],
        },
      };
    }

    // Sorting
    switch (sortBy) {
      case 'price_low':
        sort['price.amount'] = 1;
        break;
      case 'price_high':
        sort['price.amount'] = -1;
        break;
      case 'rating':
        sort['rating.average'] = -1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'popular':
        sort['stats.bookings'] = -1;
        break;
      default:
        if (q) {
          sort.score = { $meta: 'textScore' };
        }
        sort.isFeatured = -1;
        sort['rating.average'] = -1;
    }

    const skip = (page - 1) * limit;

    // Execute queries
    const [trips, total, aggregations] = await Promise.all([
      Trip.find(filter)
        .populate('vendor', 'businessName logo stats.avgRating')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Trip.countDocuments(filter),
      this.getAggregations(),
    ]);

    return {
      trips,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      aggregations,
    };
  }

  /**
   * Get search aggregations (facets)
   */
  async getAggregations() {
    try {
      const result = await Trip.aggregate([
        { $match: { status: 'published', isActive: true } },
        {
          $facet: {
            categories: [
              { $group: { _id: '$category', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
            ],
            priceRanges: [
              {
                $bucket: {
                  groupBy: '$price.amount',
                  boundaries: [0, 100, 500, 1000, 5000, Infinity],
                  default: 'Other',
                  output: { count: { $sum: 1 } },
                },
              },
            ],
            locations: [
              { $group: { _id: '$location.country', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
              { $limit: 20 },
            ],
            avgRating: [
              { $group: { _id: null, avg: { $avg: '$rating.average' } } },
            ],
          },
        },
      ]);

      return result[0];
    } catch (error) {
      logger.error('Aggregations failed:', error);
      return {
        categories: [],
        priceRanges: [],
        locations: [],
        avgRating: [{ avg: 0 }],
      };
    }
  }

  /**
   * Autocomplete suggestions
   */
  async getSuggestions(query, limit = 5) {
    if (!query || query.length < 2) {
      return [];
    }

    const trips = await Trip.find({
      status: 'published',
      $or: [
        { title: new RegExp(query, 'i') },
        { 'location.city': new RegExp(query, 'i') },
        { 'location.country': new RegExp(query, 'i') },
      ],
    })
      .select('title location.city location.country category')
      .limit(limit)
      .lean();

    return trips.map(trip => ({
      type: 'trip',
      title: trip.title,
      location: `${trip.location.city}, ${trip.location.country}`,
      category: trip.category,
    }));
  }

  /**
   * Get popular searches
   */
  async getPopularSearches(limit = 10) {
    // This would typically come from a search analytics collection
    // For now, return popular destinations
    const popular = await Trip.aggregate([
      { $match: { status: 'published', isActive: true } },
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    return popular.map(p => p._id);
  }
}

module.exports = new SearchService();
