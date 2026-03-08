import { Router } from "express";
import articlesRoutes from "./articles.routes";
import categoriesRoutes from "./categories.routes";
import reactionsRoutes from "./reactions.routes";
import commentsRoutes from "./comments.routes";
import sitemapRoutes from "./sitemap.routes";

const apiV1Router = Router();

// Content
apiV1Router.use("/articles", articlesRoutes);
apiV1Router.use("/categories", categoriesRoutes);

// Nested under /articles — reactions & comments
apiV1Router.use("/articles", reactionsRoutes);
apiV1Router.use("/articles", commentsRoutes);

// SEO
apiV1Router.use(sitemapRoutes);

export default apiV1Router;
