const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const session = require("express-session");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "public/images/products/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "product-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "lavenders_gloss",
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(
  session({
    secret: "lavenders_gloss_secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Set EJS as template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Helper function to get recommendations based on skin type (prices are now directly KSH)
const getRecommendations = (skinType) => {
  const recommendations = {
    oily: [
      {
        name: "Oil-Free Foundation",
        description: "Matte finish foundation for oily skin",
        price: 3900.0,
      },
      {
        name: "Mattifying Primer",
        description: "Controls oil and shine all day",
        price: 2600.0,
      },
      {
        name: "Clay Face Mask",
        description: "Deep cleansing clay mask",
        price: 1950.0,
      },
    ],
    dry: [
      {
        name: "Hydrating Foundation",
        description: "Moisturizing foundation for dry skin",
        price: 4550.0,
      },
      {
        name: "Hydrating Primer",
        description: "Adds moisture and smooths skin",
        price: 2925.0,
      },
      {
        name: "Moisturizing Face Mask",
        description: "Intensive hydration mask",
        price: 2275.0,
      },
    ],
    combination: [
      {
        name: "Balancing Foundation",
        description: "Perfect for combination skin",
        price: 4225.0,
      },
      {
        name: "Dual-Zone Primer",
        description: "Controls oil in T-zone, hydrates cheeks",
        price: 2795.0,
      },
      {
        name: "Balancing Toner",
        description: "Balances skin pH",
        price: 1625.0,
      },
    ],
    sensitive: [
      {
        name: "Gentle Foundation",
        description: "Hypoallergenic formula for sensitive skin",
        price: 4875.0,
      },
      {
        name: "Soothing Primer",
        description: "Calms and protects sensitive skin",
        price: 3250.0,
      },
      {
        name: "Gentle Cleanser",
        description: "Mild, fragrance-free cleanser",
        price: 1950.0,
      },
    ],
    normal: [
      {
        name: "All-Day Foundation",
        description: "Perfect coverage for normal skin",
        price: 3900.0,
      },
      {
        name: "Smoothing Primer",
        description: "Creates perfect base",
        price: 2600.0,
      },
      {
        name: "Vitamin C Serum",
        description: "Brightens and protects",
        price: 3250.0,
      },
    ],
  };

  return recommendations[skinType] || recommendations["normal"];
};

// Helper function to render a view with the layout
const renderWithLayout = (res, viewName, data) => {
  res.render(viewName, data, (err, htmlContent) => {
    if (err) {
      console.error(`Error rendering ${viewName}:`, err);
      return res.status(500).send("Error rendering page content.");
    }
    res.render("layout", {
      title: data.title || "Lavender's Gloss",
      body: htmlContent,
      user: data.user || null, // Pass user data to layout
    });
  });
};

// Routes
app.get("/", (req, res) => {
  db.query(
    "SELECT * FROM products WHERE stock > 0 ORDER BY created_at DESC LIMIT 6",
    (err, products) => {
      if (err) throw err;
      // Prices are now directly KSH from DB, ensure they are numbers
      products = products.map((product) => ({
        ...product,
        price_ksh: Number.parseFloat(product.price), // Convert to float
      }));
      renderWithLayout(res, "index", {
        products,
        user: req.session.user,
        title: "Home - Lavender's Gloss",
      });
    }
  );
});

app.get("/services", (req, res) => {
  const services = [
    {
      id: 1,
      name: "Bridal Makeup",
      price: 15000.0,
      description: "Perfect for your special day",
    },
    {
      id: 2,
      name: "Soft Glam Makeup",
      price: 8000.0,
      description: "Natural and elegant look",
    },
    {
      id: 3,
      name: "Creative Makeup",
      price: 12000.0,
      description: "Artistic and unique designs",
    },
    {
      id: 4,
      name: "SFX Makeup",
      price: 20000.0,
      description: "Special effects and transformations",
    },
  ];
  renderWithLayout(res, "services", {
    services,
    user: req.session.user,
    title: "Services - Lavender's Gloss",
  });
});

// Individual service pages
app.get("/services/bridal-makeup", (req, res) => {
  const service = {
    id: 1,
    name: "Bridal Makeup",
    price: 15000.0,
    description: "Perfect for your special day",
    duration: "3-4 hours",
  };
  renderWithLayout(res, "service-detail", {
    service,
    user: req.session.user,
    title: service.name + " - Lavender's Gloss",
  });
});

app.get("/services/soft-glam", (req, res) => {
  const service = {
    id: 2,
    name: "Soft Glam Makeup",
    price: 8000.0,
    description: "Natural and elegant look",
    duration: "2-3 hours",
  };
  renderWithLayout(res, "service-detail", {
    service,
    user: req.session.user,
    title: service.name + " - Lavender's Gloss",
  });
});

app.get("/services/creative-makeup", (req, res) => {
  const service = {
    id: 3,
    name: "Creative Makeup",
    price: 12000.0,
    description: "Artistic and unique designs",
    duration: "2-3 hours",
  };
  renderWithLayout(res, "service-detail", {
    service,
    user: req.session.user,
    title: service.name + " - Lavender's Gloss",
  });
});

app.get("/services/sfx-makeup", (req, res) => {
  const service = {
    id: 4,
    name: "SFX Makeup",
    price: 20000.0,
    description: "Special effects and transformations",
    duration: "4-5 hours",
  };
  renderWithLayout(res, "service-detail", {
    service,
    user: req.session.user,
    title: service.name + " - Lavender's Gloss",
  });
});

app.get("/about", (req, res) => {
  renderWithLayout(res, "about", {
    user: req.session.user,
    title: "About Us - Lavender's Gloss",
  });
});

app.get("/contact", (req, res) => {
  renderWithLayout(res, "contact", {
    user: req.session.user,
    title: "Contact Us - Lavender's Gloss",
  });
});

app.get("/shop", (req, res) => {
  db.query(
    "SELECT * FROM products WHERE stock > 0 ORDER BY created_at DESC",
    (err, products) => {
      if (err) throw err;
      // Prices are now directly KSH from DB, ensure they are numbers
      products = products.map((product) => ({
        ...product,
        price_ksh: Number.parseFloat(product.price), // Convert to float
      }));
      renderWithLayout(res, "shop", {
        products,
        user: req.session.user,
        title: "Shop - Lavender's Gloss",
      });
    }
  );
});

app.get("/cart", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  db.query(
    `
    SELECT c.*, p.name, p.price, p.image 
    FROM cart c 
    JOIN products p ON c.product_id = p.id 
    WHERE c.user_id = ?
  `,
    [req.session.user.id],
    (err, cartItems) => {
      if (err) throw err;
      // Prices are now directly KSH from DB, ensure they are numbers
      cartItems = cartItems.map((item) => ({
        ...item,
        price_ksh: Number.parseFloat(item.price), // Convert to float
      }));
      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      renderWithLayout(res, "cart", {
        cartItems,
        total,
        user: req.session.user,
        title: "Shopping Cart - Lavender's Gloss",
      });
    }
  );
});

app.get("/book/:serviceId", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const services = {
    1: { name: "Bridal Makeup", price: 15000.0 },
    2: { name: "Soft Glam Makeup", price: 8000.0 },
    3: { name: "Creative Makeup", price: 12000.0 },
    4: { name: "SFX Makeup", price: 20000.0 },
  };

  const service = services[req.params.serviceId];
  if (!service) {
    return res.redirect("/services");
  }

  renderWithLayout(res, "booking", {
    service,
    serviceId: req.params.serviceId,
    user: req.session.user,
    title: "Book Appointment - Lavender's Gloss",
  });
});

// Recommendations route
app.get("/recommendations/:bookingId", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  db.query(
    "SELECT * FROM bookings WHERE id = ? AND user_id = ?",
    [req.params.bookingId, req.session.user.id],
    (err, bookings) => {
      if (err) throw err;
      if (bookings.length === 0) {
        return res.redirect("/");
      }

      const booking = bookings[0];
      const recommendations = getRecommendations(booking.skin_type);
      renderWithLayout(res, "recommendations", {
        booking,
        recommendations,
        user: req.session.user,
        title: "Product Recommendations - Lavender's Gloss",
      });
    }
  );
});

app.get("/login", (req, res) => {
  renderWithLayout(res, "login", {
    user: null,
    title: "Login - Lavender's Gloss",
  });
});

app.get("/register", (req, res) => {
  renderWithLayout(res, "register", {
    user: null,
    title: "Register - Lavender's Gloss",
  });
});

app.get("/admin", (req, res) => {
  if (!req.session.user || !req.session.user.is_admin) {
    return res.redirect("/login");
  }

  db.query(
    `
    SELECT b.*, u.name as user_name 
    FROM bookings b 
    JOIN users u ON b.user_id = u.id 
    ORDER BY b.created_at DESC
  `,
    (err, bookings) => {
      if (err) throw err;

      // Prices are now directly KSH from DB, ensure they are numbers
      bookings = bookings.map((booking) => ({
        ...booking,
        service_price_ksh: Number.parseFloat(booking.service_price), // Convert to float
      }));

      db.query(
        "SELECT * FROM products ORDER BY created_at DESC",
        (err2, products) => {
          if (err2) throw err2;
          // Prices are now directly KSH from DB, ensure they are numbers
          products = products.map((product) => ({
            ...product,
            price_ksh: Number.parseFloat(product.price), // Convert to float
          }));

          db.query(
            `
        SELECT o.*, u.name as user_name 
        FROM orders o 
        JOIN users u ON o.user_id = u.id 
        ORDER BY o.created_at DESC
      `,
            (err3, orders) => {
              if (err3) throw err3;

              // Prices are now directly KSH from DB, ensure they are numbers
              orders = orders.map((order) => ({
                ...order,
                total_amount_ksh: Number.parseFloat(order.total_amount), // Convert to float
              }));

              renderWithLayout(res, "admin", {
                bookings,
                products,
                orders,
                user: req.session.user,
                title: "Admin Dashboard - Lavender's Gloss",
              });
            }
          );
        }
      );
    }
  );
});

// POST Routes
app.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, phone],
    (err, result) => {
      if (err) {
        return renderWithLayout(res, "register", {
          error: "Email already exists",
          user: null,
          title: "Register - Lavender's Gloss",
        });
      }
      res.redirect("/login");
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, users) => {
      if (err) throw err;

      if (
        users.length > 0 &&
        (await bcrypt.compare(password, users[0].password))
      ) {
        req.session.user = users[0];
        if (users[0].is_admin) {
          return res.redirect("/admin");
        }
        res.redirect("/");
      } else {
        renderWithLayout(res, "login", {
          error: "Invalid credentials",
          user: null,
          title: "Login - Lavender's Gloss",
        });
      }
    }
  );
});

app.post("/book", (req, res) => {
  const { service_name, service_price, date, time, skin_type, notes } =
    req.body;

  db.query(
    "INSERT INTO bookings (user_id, service_name, service_price, appointment_date, appointment_time, skin_type, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      req.session.user.id,
      service_name,
      service_price,
      date,
      time,
      skin_type,
      notes,
    ],
    (err, result) => {
      if (err) throw err;
      res.redirect("/payment/service/" + result.insertId);
    }
  );
});

app.post("/add-to-cart", (req, res) => {
  const { product_id, quantity } = req.body;

  db.query(
    "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?",
    [req.session.user.id, product_id, quantity, quantity],
    (err, result) => {
      if (err) throw err;
      res.json({ success: true });
    }
  );
});

app.post("/update-cart", (req, res) => {
  const { product_id, quantity } = req.body;

  if (quantity <= 0) {
    db.query(
      "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
      [req.session.user.id, product_id],
      (err) => {
        if (err) throw err;
        res.json({ success: true });
      }
    );
  } else {
    db.query(
      "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
      [quantity, req.session.user.id, product_id],
      (err) => {
        if (err) throw err;
        res.json({ success: true });
      }
    );
  }
});

app.get("/payment/service/:bookingId", (req, res) => {
  db.query(
    "SELECT * FROM bookings WHERE id = ? AND user_id = ?",
    [req.params.bookingId, req.session.user.id],
    (err, bookings) => {
      if (err) throw err;
      if (bookings.length === 0) {
        return res.redirect("/");
      }
      const booking = bookings[0];
      booking.service_price = Number.parseFloat(booking.service_price); // Ensure price is float
      renderWithLayout(res, "payment", {
        type: "service",
        item: booking,
        user: req.session.user,
        title: "Payment - Lavender's Gloss",
      });
    }
  );
});

app.get("/payment/cart", (req, res) => {
  db.query(
    `
    SELECT c.*, p.name, p.price, p.image 
    FROM cart c 
    JOIN products p ON c.product_id = p.id 
    WHERE c.user_id = ?
  `,
    [req.session.user.id],
    (err, cartItems) => {
      if (err) throw err;
      // Prices are now directly KSH, ensure they are numbers
      cartItems = cartItems.map((item) => ({
        ...item,
        price: Number.parseFloat(item.price), // Convert price to float
        quantity: Number(item.quantity), // Ensure quantity is a number
      }));
      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      renderWithLayout(res, "payment", {
        type: "cart",
        items: cartItems,
        total,
        user: req.session.user,
        title: "Payment - Lavender's Gloss",
      });
    }
  );
});

app.post("/process-payment", (req, res) => {
  // Check if user is logged in
  if (!req.session.user || !req.session.user.id) {
    return res.redirect("/login");
  }

  const { type, booking_id, phone } = req.body;

  if (type === "service") {
    // Validate booking_id
    if (!booking_id) {
      return res.redirect("/");
    }
    db.query(
      'UPDATE bookings SET payment_status = "paid" WHERE id = ? AND user_id = ?',
      [booking_id, req.session.user.id],
      (err) => {
        if (err) {
          console.error("Error updating booking payment status:", err);
          return res.status(500).send("Error processing payment.");
        }
        // Fetch the booking details to pass to the receipt page
        db.query(
          "SELECT * FROM bookings WHERE id = ? AND user_id = ?",
          [booking_id, req.session.user.id],
          (err, bookings) => {
            if (err) {
              console.error("Error fetching booking:", err);
              return res.status(500).send("Error fetching booking.");
            }
            if (bookings.length === 0) {
              return res.redirect("/");
            }
            const booking = bookings[0];
            booking.service_price = Number.parseFloat(
              booking.service_price || 0
            ); // Ensure price is float
            // console.log("Service receipt data:", {
            //   type: "service",
            //   item: booking,
            //   total: booking.service_price,
            // });
            renderWithLayout(res, "receipt", {
              type: "service",
              item: booking,
              total: booking.service_price,
              user: req.session.user,
              title: "Receipt - Lavender's Gloss",
            });
          }
        );
      }
    );
  } else {
    // Process cart payment
    db.query(
      `
      SELECT c.*, p.name, p.price 
      FROM cart c 
      JOIN products p ON c.product_id = p.id 
      WHERE c.user_id = ?
    `,
      [req.session.user.id],
      (err, cartItems) => {
        if (err) {
          console.error("Error fetching cart items:", err);
          return res.status(500).send("Error fetching cart items.");
        }
        // Prices are now directly KSH, ensure they are numbers
        cartItems = cartItems.map((item) => ({
          ...item,
          price: Number.parseFloat(item.price || 0), // Convert to float with fallback
          quantity: Number(item.quantity || 0), // Ensure quantity is a number
        }));
        const total = cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        // Create order
        db.query(
          "INSERT INTO orders (user_id, total_amount, items) VALUES (?, ?, ?)",
          [req.session.user.id, total, JSON.stringify(cartItems)],
          (err, result) => {
            if (err) {
              console.error("Error creating order:", err);
              return res.status(500).send("Error creating order.");
            }

            // Update stock and clear cart
            cartItems.forEach((item) => {
              db.query(
                "UPDATE products SET stock = stock - ? WHERE id = ?",
                [item.quantity, item.product_id],
                (err) => {
                  if (err) console.error("Error updating product stock:", err);
                }
              );
            });

            db.query(
              "DELETE FROM cart WHERE user_id = ?",
              [req.session.user.id],
              (err) => {
                if (err) {
                  console.error("Error clearing cart:", err);
                  return res.status(500).send("Error clearing cart.");
                }
                console.log("Cart receipt data:", {
                  type: "cart",
                  order_id: result.insertId,
                  items: cartItems,
                  total,
                });
                renderWithLayout(res, "receipt", {
                  type: "cart",
                  order_id: result.insertId,
                  items: cartItems,
                  total,
                  user: req.session.user,
                  title: "Receipt - Lavender's Gloss",
                });
              }
            );
          }
        );
      }
    );
  }
});

app.post("/contact", (req, res) => {
  const { first_name, last_name, email, phone, subject, message } = req.body;

  db.query(
    "INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)",
    [first_name, last_name, email, phone, subject, message],
    (err, result) => {
      if (err) {
        console.error("Error saving contact message:", err);
        return renderWithLayout(res, "contact", {
          user: req.session.user,
          error: "Failed to send message. Please try again.",
          title: "Contact Us - Lavender's Gloss",
        });
      }
      renderWithLayout(res, "contact", {
        user: req.session.user,
        success: "Your message has been sent successfully!",
        title: "Contact Us - Lavender's Gloss",
      });
    }
  );
});

app.post("/admin/approve-booking/:id", (req, res) => {
  db.query(
    'UPDATE bookings SET status = "approved" WHERE id = ?',
    [req.params.id],
    (err) => {
      if (err) throw err;
      res.redirect("/admin");
    }
  );
});

app.post("/admin/reject-booking/:id", (req, res) => {
  db.query(
    'UPDATE bookings SET status = "rejected" WHERE id = ?',
    [req.params.id],
    (err) => {
      if (err) throw err;
      res.redirect("/admin");
    }
  );
});

// Add product with image upload (price is now KSH directly)
app.post("/admin/add-product", upload.single("image"), (req, res) => {
  const { name, price, description, stock } = req.body;
  const imagePath = req.file
    ? `/images/products/${req.file.filename}`
    : "/images/placeholder-product.jpg";

  db.query(
    "INSERT INTO products (name, price, description, stock, image) VALUES (?, ?, ?, ?, ?)",
    [name, price, description, stock, imagePath],
    (err) => {
      if (err) throw err;
      res.redirect("/admin");
    }
  );
});

// Delete product
app.post("/admin/delete-product/:id", (req, res) => {
  if (!req.session.user || !req.session.user.is_admin) {
    return res.redirect("/login");
  }

  // Get product info first to delete image file
  db.query(
    "SELECT image FROM products WHERE id = ?",
    [req.params.id],
    (err, products) => {
      if (err) throw err;

      if (
        products.length > 0 &&
        products[0].image !== "/images/placeholder-product.jpg"
      ) {
        const imagePath = path.join(__dirname, "public", products[0].image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      // Delete from cart first (foreign key constraint)
      db.query(
        "DELETE FROM cart WHERE product_id = ?",
        [req.params.id],
        (err) => {
          if (err) throw err;

          // Then delete the product
          db.query(
            "DELETE FROM products WHERE id = ?",
            [req.params.id],
            (err) => {
              if (err) throw err;
              res.redirect("/admin");
            }
          );
        }
      );
    }
  );
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
