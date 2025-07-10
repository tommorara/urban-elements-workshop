const Order = require('../models/Order');
const CustomRequest = require('../models/CustomRequest');
const User = require('../models/User');

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    // First, find the logged-in user's email
    const user = await User.findById(userId).select('email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [orders, customRequests] = await Promise.all([
      // Fetch orders created by this user or where their email was used (legacy)
      Order.find({
        $or: [
          { user: userId },
          { email: user.email }
        ]
      }).sort({ createdAt: -1 }),

      CustomRequest.find({ user: userId }).sort({ createdAt: -1 })
    ]);

    if (!orders.length && !customRequests.length) {
      return res.status(200).json({ orders: [], customRequests: [] });
    }

    res.status(200).json({ orders, customRequests });

  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ message: 'Failed to fetch user orders' });
  }
};
