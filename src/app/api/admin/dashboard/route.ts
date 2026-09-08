import { jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import Product from "@/models/Product";
import Service from "@/models/Service";
import Order from "@/models/Order";
import ContactMessage from "@/models/ContactMessage";
import BlogPost from "@/models/BlogPost";
import Offer from "@/models/Offer";

export async function GET() {
  return withAdmin(async () => {
    const [products, services, orders, unreadMessages, draftBlogs, activeOffers, pendingOrders] =
      await Promise.all([
        Product.countDocuments(),
        Service.countDocuments(),
        Order.countDocuments(),
        ContactMessage.countDocuments({ status: "unread" }),
        BlogPost.countDocuments({ status: "draft" }),
        Offer.countDocuments({ status: "published" }),
        Order.countDocuments({ orderStatus: { $in: ["pending", "awaiting_payment"] } }),
      ]);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).lean();

    return jsonOk(
      serialize({
        stats: {
          products,
          services,
          orders,
          unreadMessages,
          draftBlogs,
          activeOffers,
          pendingOrders,
        },
        recentOrders,
      })
    );
  });
}
