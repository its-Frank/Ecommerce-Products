# Lavender's Gloss - Makeup Booking & E-commerce Website

A full-stack website for booking makeup appointments and purchasing beauty products.

## Features

### User Features
- User registration and authentication
- Browse and book makeup services (Bridal, Soft Glam, Creative, SFX)
- Shop makeup products with cart functionality
- Skin type selection for personalized service
- M-Pesa payment integration (dummy)
- Receipt generation
- Responsive design with custom color scheme

### Admin Features
- Admin dashboard for managing bookings, products, and orders
- Approve/reject appointment bookings
- Add new products to inventory
- View customer orders and revenue
- Stock management

### Services Offered
1. **Bridal Makeup** - $150 (Perfect for your special day)
2. **Soft Glam Makeup** - $80 (Natural and elegant look)
3. **Creative Makeup** - $120 (Artistic and unique designs)
4. **SFX Makeup** - $200 (Special effects and transformations)

## Technology Stack

- **Frontend**: EJS templates with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MySQL
- **Authentication**: bcrypt for password hashing
- **Session Management**: express-session

## Color Scheme
- Primary: #560255 (Deep Purple)
- Secondary: #Ad73b1 (Light Purple)
- Accent: #F1b8c0 (Pink)

## Installation & Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd lavenders-gloss
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up MySQL database**
   - Create a MySQL database named `lavenders_gloss`
   - Run the SQL schema provided in `database_schema.sql`
   - Update database credentials in `app.js`

4. **Create required directories**
   \`\`\`bash
   mkdir public
   mkdir public/images
   mkdir views
   \`\`\`

5. **Add placeholder images**
   - Add product images to `public/images/`
   - Use placeholder images as specified in the code

6. **Start the application**
   \`\`\`bash
   npm start
   # or for development
   npm run dev
   \`\`\`

7. **Access the application**
   - Open http://localhost:3000 in your browser
   - Admin login: admin@lavendersgloss.com / admin123

## Database Schema

The application uses the following main tables:
- `users` - User accounts and admin management
- `products` - Makeup products inventory
- `bookings` - Appointment bookings with skin type info
- `cart` - Shopping cart items
- `orders` - Completed purchases

## Key Features Implementation

### Appointment Booking
- Users select service type and provide skin type information
- Admin can approve/reject bookings
- Payment required before confirmation

### E-commerce
- Product catalog with stock management
- Shopping cart functionality
- Stock automatically reduces after purchase
- Order history tracking

### Payment System
- Dummy M-Pesa integration
- Receipt generation after successful payment
- Payment confirmation workflow

### Admin Panel
- Comprehensive dashboard with statistics
- Booking management with approval workflow
- Product inventory management
- Order tracking and revenue reporting

## File Structure

\`\`\`
lavenders-gloss/
├── app.js                 # Main server file
├── package.json          # Dependencies
├── database_schema.sql   # Database setup
├── views/               # EJS templates
│   ├── layout.ejs       # Main layout
│   ├── index.ejs        # Homepage
│   ├── services.ejs     # Services page
│   ├── booking.ejs      # Booking form
│   ├── shop.ejs         # Product catalog
│   ├── cart.ejs         # Shopping cart
│   ├── payment.ejs      # Payment page
│   ├── receipt.ejs      # Receipt page
│   ├── admin.ejs        # Admin dashboard
│   ├── about.ejs        # About page
│   ├── contact.ejs      # Contact page
│   ├── login.ejs        # Login form
│   └── register.ejs     # Registration form
└── public/              # Static files
    └── images/          # Image assets
\`\`\`

## Customization

### Colors
The website uses CSS custom properties for easy color customization. Update the Tailwind config in the layout template to change the color scheme.

### Images
Replace placeholder images in the `public/images/` directory with actual product and service images.

### Services
Modify the services array in the routes to add/remove/update makeup services and pricing.

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- SQL injection prevention with parameterized queries
- Admin role-based access control

## Future Enhancements

- Real payment gateway integration
- Email notifications
- SMS confirmations
- Advanced inventory management
- Customer reviews and ratings
- Appointment calendar integration
- Multi-language support

## Support

For technical support or questions about the implementation, please refer to the code comments and documentation within each file.
