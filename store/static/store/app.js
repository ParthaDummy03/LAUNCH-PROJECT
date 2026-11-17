(function () {
  const root = document.documentElement;
  const bnText = {
    'FRESHLY MADE. HAPPILY DELIVERED.': 'তাজা রান্না, আনন্দের ডেলিভারি।',
    'TAZA FOOD CORNER · CHITTAGONG': 'তাজা ফুড কর্নার · চট্টগ্রাম',
    'Home': 'হোম', 'Menu': 'মেনু', 'Offers': 'অফার', 'Dine-in': 'রেস্টুরেন্টে বসে খান',
    'Coupons': 'কুপন', 'Order history': 'অর্ডারের ইতিহাস', 'Delivery': 'হোম ডেলিভারি',
    'Find an outlet': 'কাছের আউটলেট খুঁজুন', 'Outlet opening hours': 'আউটলেট খোলার সময়',
    'Feedback': 'মতামত', 'FAQ': 'সাধারণ জিজ্ঞাসা', 'Contact us': 'যোগাযোগ করুন', 'About': 'আমাদের সম্পর্কে',
    'Signed in as': 'সাইন ইন করেছেন:', 'Sign out': 'সাইন আউট', 'Sign in': 'সাইন ইন', 'SIGN IN': 'সাইন ইন',
    'Create account': 'অ্যাকাউন্ট তৈরি করুন', 'ACCOUNT': 'অ্যাকাউন্ট', 'CART': 'কার্ট',
    'FRESHLY MADE': 'তাজা রান্না', 'FULL OF FLAVOUR': 'স্বাদে ভরপুর', 'GOOD FOOD. GOOD MOOD.': 'ভালো খাবার, ভালো মেজাজ।',
    'Your cravings.': 'আপনার খিদে,', 'Our kitchen.': 'আমাদের রান্নাঘর।',
    'Freshly prepared favourites, made with care and delivered with a smile. Find your next Taza favourite.': 'যত্নে তৈরি পছন্দের খাবার, হাসিমুখে পৌঁছে দিই আপনার দরজায়। খুঁজে নিন তাজার পরের প্রিয় খাবার।',
    'Order for delivery': 'ডেলিভারিতে অর্ডার করুন', 'Dine in with us': 'আমাদের সঙ্গে বসে খান',
    'FRESH. BOLD. TAZA.': 'তাজা। মজাদার। তাজা।', 'Enjoy Taza': 'তাজার স্বাদ নিন', 'at your place.': 'আপনার ঘরে।',
    'Your table': 'আপনার টেবিল', 'is waiting.': 'আপনার অপেক্ষায়।', 'Explore menu': 'মেনু দেখুন', 'Find an outlet': 'আউটলেট খুঁজুন',
    'A LITTLE SOMETHING EXTRA': 'আপনার জন্য বাড়তি কিছু', 'Offers in': 'বিশেষ', 'featured.': 'অফারসমূহ', 'View all offers': 'সব অফার দেখুন',
    'FEATURED OFFER': 'বিশেষ অফার', 'USE CODE': 'কোড ব্যবহার করুন', 'No active offers right now. Please check back soon.': 'এখন কোনো অফার চালু নেই। পরে আবার দেখুন।',
    'HAND-PICKED FOR YOU': 'আপনার জন্য বাছাই করা', 'Featured': 'বিশেষ', 'favourites.': 'পছন্দের খাবার', 'Explore all items': 'সব খাবার দেখুন',
    'No featured items yet. Add products in the admin panel.': 'এখনো কোনো বিশেষ খাবার নেই। অ্যাডমিন প্যানেল থেকে খাবার যোগ করুন।',
    'THE TAZA PROMISE': 'তাজার প্রতিশ্রুতি', 'Made fresh.': 'তাজা করে তৈরি।', 'Made for moments.': 'সুন্দর মুহূর্তের জন্য।',
    'From a quick bite to a table full of friends, we bring flavour, freshness and a little joy to every order.': 'হালকা নাস্তা হোক বা বন্ধুদের সঙ্গে ভোজ—প্রতিটি অর্ডারে থাকুক স্বাদ, সতেজতা আর একটু আনন্দ।',
    'YOUR ORDER': 'আপনার অর্ডার', 'Your ': 'আপনার ', 'cart.': 'কার্ট।', 'Take one last look before making it yours.': 'অর্ডার নিশ্চিত করার আগে আরেকবার দেখে নিন।',
    'YOUR TAZA PICKS': 'তাজার পছন্দ', 'Selected items': 'নির্বাচিত খাবার', '+ Add more': '+ আরও যোগ করুন', 'QTY': 'পরিমাণ', 'UPDATE': 'হালনাগাদ',
    'Your cart is waiting.': 'আপনার কার্ট অপেক্ষায় আছে।', 'Add something delicious from the Taza menu.': 'তাজার মেনু থেকে মজার কিছু যোগ করুন।',
    'ORDER SUMMARY': 'অর্ডারের সারাংশ', 'Almost ': 'আর একটু ', 'there.': 'বাকি।', 'Subtotal': 'উপমোট', 'Estimated total': 'আনুমানিক মোট',
    'Continue to checkout': 'চেকআউটে যান', 'Coupons can be added at checkout.': 'চেকআউটে কুপন যোগ করতে পারবেন।',
    'CHECKOUT': 'চেকআউট', 'Make it ': 'এবার অর্ডার ', 'official.': 'নিশ্চিত করুন।', 'Tell us where to bring your Taza favourites.': 'তাজার খাবার কোথায় পৌঁছে দেব জানিয়ে দিন।',
    'ORDER DETAILS': 'অর্ডারের বিবরণ', 'Your details': 'আপনার তথ্য', 'Full name': 'পুরো নাম', 'Phone number': 'ফোন নম্বর',
    'How would you like to enjoy Taza?': 'আপনি কীভাবে তাজার খাবার নিতে চান?', 'Delivered to your door': 'আপনার ঠিকানায় পৌঁছে দেব',
    'Enjoy your meal at an outlet': 'আউটলেটে বসে খাবার উপভোগ করুন', 'Choose outlet': 'আউটলেট বেছে নিন',
    'For dine-in, select the outlet you want to visit.': 'বসে খাওয়ার জন্য যে আউটলেটে যাবেন সেটি বেছে নিন।', 'Find outlets on map': 'মানচিত্রে আউটলেট দেখুন',
    'Delivery address': 'ডেলিভারির ঠিকানা', 'Final touches': 'শেষ ধাপ', 'Coupon code (optional)': 'কুপন কোড (ঐচ্ছিক)',
    'Try WELCOME10, TAZA50 or FAMILYFEAST on eligible orders.': 'যোগ্য অর্ডারে WELCOME10, TAZA50 অথবা FAMILYFEAST ব্যবহার করুন।',
    'Special instructions': 'বিশেষ নির্দেশনা', 'Place my order': 'অর্ডার নিশ্চিত করুন', 'Calculated by fulfilment': 'ডেলিভারি/বসার ধরন অনুযায়ী হিসাব হবে',
    'Subtotal before coupon': 'কুপনের আগের উপমোট', 'Your final delivery fee and coupon discount will be calculated after you submit the order.': 'অর্ডার জমা দিলে ডেলিভারি চার্জ ও কুপনের ছাড় হিসাব করা হবে।',
    'GOOD THINGS COME WITH A DEAL': 'দারুণ খাবারের সঙ্গে দারুণ ছাড়', 'Offers made': 'অফার', 'to share.': 'সবার জন্য।',
    'Discover the latest Taza promotions and featured deals.': 'তাজার নতুন প্রচার ও বিশেষ অফারগুলো দেখুন।', 'ACTIVE OFFER': 'চলতি অফার',
    'DISCOUNT': 'ছাড়', 'MINIMUM ORDER ৳': 'সর্বনিম্ন অর্ডার ৳', 'There are no active offers right now. Please check back soon.': 'এখন কোনো অফার চালু নেই। পরে আবার দেখুন।',
    'USE AT CHECKOUT': 'চেকআউটে ব্যবহার করুন', 'Current ': 'চলতি ', 'coupons.': 'কুপন', 'All coupons ↗': 'সব কুপন ↗',
    'No active coupons right now.': 'এখন কোনো কুপন চালু নেই।', 'TAZA COUPON': 'তাজার কুপন',
    'SOMETHING FOR YOUR ORDER': 'আপনার অর্ডারের জন্য বিশেষ কিছু', 'Coupon': 'কুপন', 'corner.': 'কর্নার।',
    'Copy a code and apply it during checkout.': 'কোড কপি করে চেকআউটে ব্যবহার করুন।', 'Minimum order ৳': 'সর্বনিম্ন অর্ডার ৳',
    'COPY CODE ↗': 'কোড কপি করুন ↗', 'No active coupons available.': 'এখন কোনো কুপন চালু নেই।',
    'PAGE 02 · DELIVERY MENU': 'পৃষ্ঠা ০২ · ডেলিভারি মেনু', 'All the good': 'সব মজার', 'stuff.': 'খাবার।',
    'Explore every Taza favourite. Choose your item and set the quantity in units.': 'তাজার সব পছন্দের খাবার দেখুন। খাবার বেছে পরিমাণ ঠিক করুন।',
    'ALL PRODUCTS': 'সব খাবার', 'FRESHLY PREPARED': 'তাজা করে তৈরি', 'All items': 'সব খাবার', 'SEARCH ↗': 'খুঁজুন ↗',
    'ITEMS AVAILABLE': 'টি খাবার পাওয়া যাচ্ছে', 'COUNT IN UNIT · PRICES IN BDT': 'পরিমাণ এককে · দাম টাকা',
    'No items found. Try another category or search.': 'কোনো খাবার পাওয়া যায়নি। অন্য বিভাগ বা শব্দ দিয়ে খুঁজুন।',
    'Found your favourites?': 'পছন্দের খাবার পেয়েছেন?', 'Review your cart': 'কার্ট দেখুন',
    'WE WOULD LOVE TO HEAR FROM YOU': 'আপনার কথা শুনতে চাই', 'Say ': 'বলুন ', 'hello.': 'হ্যালো।',
    'Have a question about an order, an outlet or a Taza experience?': 'অর্ডার, আউটলেট বা তাজার অভিজ্ঞতা নিয়ে প্রশ্ন আছে?',
    'CALL US': 'ফোন করুন', "Let's talk.": 'কথা বলি।', 'SUPPORT': 'সহায়তা', 'WRITE TO US': 'আমাদের লিখুন',
    'We read every': 'আমরা পড়ি প্রতিটি', 'message.': 'বার্তা।', 'Send feedback': 'মতামত পাঠান',
    "WE'RE LISTENING": 'আমরা শুনছি', 'Your thoughts': 'আপনার মতামত', 'matter.': 'গুরুত্বপূর্ণ।',
    'Tell us about your experience. Your feedback helps us serve you better.': 'আপনার অভিজ্ঞতা জানান। আপনার মতামত আমাদের আরও ভালো সেবা দিতে সাহায্য করে।',
    'Name': 'নাম', 'Email (optional)': 'ইমেইল (ঐচ্ছিক)', 'Subject': 'বিষয়', 'Your feedback': 'আপনার মতামত',
    'A FEW QUICK ANSWERS': 'কিছু সাধারণ প্রশ্নের উত্তর', 'Frequently': 'সাধারণ', 'asked.': 'জিজ্ঞাসা।',
    'Everything you need to know before placing your Taza order.': 'তাজার অর্ডার দেওয়ার আগে আপনার প্রয়োজনীয় সব তথ্য।',
    'How do I place a delivery order?': 'ডেলিভারি অর্ডার কীভাবে দেব?',
    'Choose Delivery on the home page, browse the menu, add items to your cart and complete the checkout form with your phone number and delivery address.': 'হোম পেজে ডেলিভারি বেছে নিয়ে মেনু দেখুন, খাবার কার্টে যোগ করুন এবং ফোন নম্বর ও ঠিকানা দিয়ে চেকআউট সম্পন্ন করুন।',
    'How do I find a dine-in outlet?': 'বসে খাওয়ার আউটলেট কীভাবে খুঁজব?',
    'Choose Dine-in, press “Use my location” to request browser location permission, set your search radius and select an outlet from the map or list.': 'বসে খাওয়া বেছে নিয়ে “আমার অবস্থান ব্যবহার করুন” চাপুন, খোঁজার দূরত্ব ঠিক করুন এবং মানচিত্র বা তালিকা থেকে আউটলেট বেছে নিন।',
    'Can I update the outlet locations and phone numbers?': 'আউটলেটের ঠিকানা ও ফোন নম্বর কি বদলানো যাবে?',
    'Yes. Sign in to the Django Admin panel and update the Outlet records. The locations in the starter data are clearly marked as demo locations.': 'হ্যাঁ। Django Admin-এ সাইন ইন করে আউটলেটের তথ্য হালনাগাদ করুন। নমুনা তথ্যগুলো ডেমো হিসেবে চিহ্নিত।',
    'Are online bKash and card payments real?': 'অনলাইনে বিকাশ ও কার্ডে পেমেন্ট কি সত্যি?',
    'No. They are demonstration-only options in this student project. They do not charge money or connect to a payment provider. Cash on delivery and pay-at-outlet are the available real-world workflow choices in this sample.': 'না। এই শিক্ষামূলক প্রকল্পে এগুলো শুধু প্রদর্শনের জন্য। কোনো টাকা কাটা হয় না বা পেমেন্ট সেবার সঙ্গে সংযোগ নেই। নমুনায় ক্যাশ অন ডেলিভারি ও আউটলেটে পেমেন্টের ধাপ দেখানো হয়েছে।',
    'Where can I see my previous orders?': 'আগের অর্ডারগুলো কোথায় দেখব?',
    'Create an account and sign in. Open the menu and choose Order history to view orders placed while signed in.': 'অ্যাকাউন্ট তৈরি করে সাইন ইন করুন। মেনু থেকে অর্ডারের ইতিহাস বেছে নিলে সাইন ইন অবস্থায় দেওয়া অর্ডারগুলো দেখতে পাবেন।',
    'What if I do not allow location access?': 'অবস্থানের অনুমতি না দিলে কী হবে?',
    'You can still see the outlet list and select an outlet manually. Distance filtering will be available only after you share your location.': 'তবুও আউটলেটের তালিকা দেখে নিজে বেছে নিতে পারবেন। অবস্থান জানালে দূরত্ব অনুযায়ী ছাঁকার সুবিধা পাবেন।',
    'PLAN YOUR VISIT': 'আপনার ভ্রমণের পরিকল্পনা করুন', 'Opening ': 'খোলার ', 'hours.': 'সময়।',
    'Check the listed hours before visiting your selected outlet.': 'আউটলেটে যাওয়ার আগে খোলার সময় দেখে নিন।', 'DEMO DATA': 'নমুনা তথ্য', 'No outlets added yet.': 'এখনো কোনো আউটলেট যোগ করা হয়নি।',
    'YOUR TAZA ACCOUNT': 'আপনার তাজা অ্যাকাউন্ট', 'Order ': 'অর্ডারের ', 'history.': 'ইতিহাস।', 'Your previous orders, all in one place.': 'আপনার আগের সব অর্ডার এক জায়গায়।',
    'View order ↗': 'অর্ডার দেখুন ↗', 'No orders yet.': 'এখনো কোনো অর্ডার নেই।', 'Your Taza order history will appear here after your first order.': 'প্রথম অর্ডারের পর এখানে আপনার অর্ডারের ইতিহাস দেখা যাবে।',
    'PAGE 03 · OUTLET FINDER': 'পৃষ্ঠা ০৩ · আউটলেট খুঁজুন', 'Come on ': 'চলে আসুন ', 'over.': 'তাজার কাছে।',
    'Find your nearest Taza outlet. Allow location access to see outlets within your chosen radius.': 'কাছের তাজা আউটলেট খুঁজুন। নির্দিষ্ট দূরত্বের আউটলেট দেখতে অবস্থানের অনুমতি দিন।',
    'FIND YOUR OUTLET': 'আপনার আউটলেট খুঁজুন', 'LOCATION PERMISSION': 'অবস্থানের অনুমতি', 'Find Taza': 'তাজাকে খুঁজুন', 'near you.': 'আপনার কাছে।',
    'We’ll use your location only to calculate nearby outlets. Your browser will ask permission after you press the button.': 'কাছের আউটলেটের দূরত্ব হিসাব করতেই শুধু আপনার অবস্থান ব্যবহার হবে। বোতাম চাপলে ব্রাউজার অনুমতি চাইবে।',
    'Use my location': 'আমার অবস্থান ব্যবহার করুন', 'SEARCH RADIUS': 'খোঁজার দূরত্ব', 'SELECT FOR:': 'অর্ডারের ধরন:', 'DINE-IN': 'বসে খাওয়া',
    'OUTLETS AROUND YOU': 'আপনার আশেপাশের আউটলেট', 'Map tiles require an internet connection. Demo outlets are sample locations and must be replaced with your real branch details.': 'মানচিত্র দেখতে ইন্টারনেট সংযোগ দরকার। ডেমো আউটলেটগুলো নমুনা অবস্থান; ব্যবহারের আগে আসল শাখার তথ্য দিন।',
    'PICK YOUR SPOT': 'আপনার আউটলেট বেছে নিন', 'Outlet ': 'আউটলেটের ', 'list.': 'তালিকা।', 'Select this outlet': 'এই আউটলেট বেছে নিন',
    'DEMO LOCATION': 'নমুনা অবস্থান', 'No active outlets yet. Add outlets in Django Admin.': 'এখনো কোনো আউটলেট চালু নেই। Django Admin-এ আউটলেট যোগ করুন।',
    'PAGE 05 · PAYMENT OPTION': 'পৃষ্ঠা ০৫ · পেমেন্টের ধরন', 'Choose how': 'পেমেন্টের ধরন', 'to ': 'বেছে ', 'pay.': 'নিন।',
    'Securely select the payment option that works for you.': 'আপনার সুবিধামতো পেমেন্টের ধরন বেছে নিন।', 'PAYMENT OPTIONS': 'পেমেন্টের ধরনসমূহ', 'SELECT PAYMENT METHOD': 'পেমেন্টের ধরন বেছে নিন',
    'One last ': 'আর একটি ', 'step.': 'ধাপ।', 'Pay at outlet': 'আউটলেটে পেমেন্ট', 'Settle your bill at the selected branch.': 'নির্বাচিত শাখায় বিল পরিশোধ করুন।',
    'Cash on delivery': 'ক্যাশ অন ডেলিভারি', 'Pay in cash when your order arrives.': 'অর্ডার পৌঁছালে নগদে পরিশোধ করুন।', 'bKash · demo only': 'বিকাশ · শুধু ডেমো',
    'Simulated payment for project demonstration. No real transaction.': 'প্রকল্প প্রদর্শনের জন্য নমুনা পেমেন্ট। আসল লেনদেন নয়।', 'Card · demo only': 'কার্ড · শুধু ডেমো',
    'Simulated payment for project demonstration. No card details are collected.': 'প্রকল্প প্রদর্শনের জন্য নমুনা পেমেন্ট। কার্ডের তথ্য নেওয়া হয় না।', 'Confirm payment option': 'পেমেন্টের ধরন নিশ্চিত করুন',
    'Your project does not store card numbers, CVV, PINs or banking passwords. Real online payments require a verified payment gateway.': 'এই প্রকল্প কার্ড নম্বর, CVV, PIN বা ব্যাংক পাসওয়ার্ড সংরক্ষণ করে না। আসল অনলাইন পেমেন্টের জন্য যাচাইকৃত পেমেন্ট গেটওয়ে দরকার।',
    'PAYMENT SUMMARY': 'পেমেন্টের সারাংশ', 'Order ': 'অর্ডার ', 'Order total': 'অর্ডারের মোট', 'Amount due': 'পরিশোধযোগ্য', 'Payment status:': 'পেমেন্টের অবস্থা:', '← Back to confirmed order': '← নিশ্চিত অর্ডারে ফিরুন',
    'PAGE 04 · CONFIRMED ORDER': 'পৃষ্ঠা ০৪ · অর্ডার নিশ্চিত', "It's a": 'অর্ডার ', 'go!': 'নিশ্চিত!', 'Thank you for choosing Taza. Your order has been received.': 'তাজাকে বেছে নেওয়ার জন্য ধন্যবাদ। আপনার অর্ডারটি পাওয়া গেছে।',
    'YOUR ORDER NUMBER': 'আপনার অর্ডার নম্বর', 'Keep this number for your reference.': 'প্রয়োজনে এই নম্বরটি সংরক্ষণ করুন।', 'Order placed': 'অর্ডার দেওয়া হয়েছে', 'Preparing': 'তৈরি হচ্ছে', 'On the way / Ready': 'পথে আছে / প্রস্তুত',
    'ORDER TYPE': 'অর্ডারের ধরন', 'ORDER STATUS': 'অর্ডারের অবস্থা', 'PAYMENT STATUS': 'পেমেন্টের অবস্থা', 'TOTAL': 'মোট', 'Choose payment option': 'পেমেন্টের ধরন বেছে নিন', 'Back to home': 'হোমে ফিরুন',
    'Your Taza ': 'তাজার আপনার ', 'selection.': 'পছন্দ।', 'Delivery fee': 'ডেলিভারি চার্জ', 'Discount': 'ছাড়', 'Selected outlet:': 'নির্বাচিত আউটলেট:',
    'WELCOME TO TAZA': 'তাজায় স্বাগতম', 'Make every': 'প্রতিটি খাবারকে', 'meal a ': 'বানান এক ', 'moment.': 'সুন্দর মুহূর্ত।',
    'Create an account to keep track of your Taza orders.': 'তাজার অর্ডারের হিসাব রাখতে অ্যাকাউন্ট তৈরি করুন।', 'JOIN THE TAZA FAMILY': 'তাজা পরিবারের সদস্য হোন', 'Create your ': 'তৈরি করুন আপনার ', 'account.': 'অ্যাকাউন্ট।', 'Already have an account?': 'আগে থেকেই অ্যাকাউন্ট আছে?',
    'WE WOULD LOVE TO HEAR FROM YOU': 'আপনার কথা শুনতে চাই', 'THIS IS TAZA': 'এটাই তাজা', 'Good food.': 'ভালো খাবার।', 'Good company.': 'সুন্দর সঙ্গ।',
    'TAZA FOOD CORNER is a food ordering website concept built around a simple idea: make it easy to discover a meal, choose an outlet and enjoy good food your way.': 'তাজা ফুড কর্নার একটি খাবার অর্ডারের ওয়েবসাইটের ধারণা—সহজে খাবার খুঁজুন, আউটলেট বেছে নিন এবং নিজের মতো উপভোগ করুন।',
    'Freshness': 'সতেজতা', 'Make food fresh and serve it with care.': 'তাজা খাবার যত্নে পরিবেশন করি।', 'Convenience': 'সুবিধা', 'Order for delivery or find a place to dine in.': 'ডেলিভারি অর্ডার করুন অথবা বসে খাওয়ার জায়গা খুঁজুন।',
    'Connection': 'একসঙ্গে', 'Bring people together over a meal.': 'একটি খাবার মানুষকে কাছে আনে।', 'Good food brings people together.': 'ভালো খাবার মানুষকে কাছে আনে।', 'We make every bite count.': 'প্রতিটি লোকমায় থাকুক আনন্দ।',
    'VISIT US': 'আমাদের ঠিকানা', 'Outlet opening hour': 'আউটলেট খোলার সময়', 'HELP & SUPPORT': 'সহায়তা', '©': '©',
    'ALL RIGHTS RESERVED.': 'সর্বস্বত্ব সংরক্ষিত।', 'MADE WITH CARE · RED / BLACK / WHITE': 'যত্নে তৈরি · লাল / কালো / সাদা',
    'Ask Taza': 'তাজাকে জিজ্ঞাসা করুন', 'Menu assistant': 'মেনু সহকারী', 'Hi! Ask me about the menu, delivery, or dine-in.': 'হ্যালো! মেনু, ডেলিভারি বা বসে খাওয়া নিয়ে জিজ্ঞাসা করুন।',
    'Ask about the menu': 'মেনু সম্পর্কে জিজ্ঞাসা করুন', 'Ask about the menu…': 'মেনু সম্পর্কে লিখুন…', 'Send': 'পাঠান', 'Loading weather…': 'আবহাওয়ার তথ্য আসছে…',
    'Use my location': 'আমার অবস্থান ব্যবহার করুন', 'Switch white/dark theme': 'হালকা/গাঢ় থিম বদলান', 'Switch theme': 'থিম বদলান', 'Open menu': 'মেনু খুলুন',
    'Main navigation': 'প্রধান নেভিগেশন', 'Shopping cart': 'কেনাকাটার কার্ট', 'Local weather': 'স্থানীয় আবহাওয়া', 'Taza menu assistant': 'তাজার মেনু সহকারী',
    'Add more': 'আরও যোগ করুন', 'Selected items': 'নির্বাচিত খাবার', 'Estimated total': 'আনুমানিক মোট', 'Continue to checkout': 'চেকআউটে যান',
    'COPY CODE': 'কোড কপি করুন', 'COPIED ✓': 'কপি হয়েছে ✓', 'Quantity': 'পরিমাণ', 'Add': 'যোগ করুন', 'SAVE': 'সংরক্ষণ', 'UPDATE': 'হালনাগাদ',
    'MANAGEMENT': 'ব্যবস্থাপনা', 'Staff ': 'কর্মী ', 'dashboard.': 'ড্যাশবোর্ড।', 'Review orders and update their current status.': 'অর্ডার দেখুন এবং বর্তমান অবস্থা হালনাগাদ করুন।',
    'ORDER': 'অর্ডার', 'CUSTOMER': 'গ্রাহক', 'TYPE': 'ধরন', 'STATUS': 'অবস্থা', 'No orders to display.': 'দেখানোর মতো কোনো অর্ডার নেই।',
    'DELIVERY TEAM': 'ডেলিভারি দল', 'Delivery ': 'ডেলিভারি ', 'management.': 'ব্যবস্থাপনা।', 'Update an order when it leaves the outlet and when it is delivered.': 'আউটলেট থেকে রওনা হলে এবং পৌঁছালে অর্ডারের অবস্থা হালনাগাদ করুন।',
    'ADDRESS': 'ঠিকানা', 'PHONE': 'ফোন', 'No active delivery orders.': 'এখন কোনো ডেলিভারি অর্ডার নেই।', 'Open menu': 'মেনু খুলুন',
  };
  Object.assign(bnText, {
    'Your': 'আপনার', 'Almost': 'আর একটু', 'Make it': 'এবার অর্ডার', 'Current': 'চলতি', 'Order': 'অর্ডার',
    'Staff': 'কর্মী', 'Delivery': 'ডেলিভারি', 'to': 'দিকে', 'Say': 'বলুন', 'We read every': 'আমরা পড়ি প্রতিটি',
    'DINE-IN': 'বসে খাওয়া', 'Pending': 'অপেক্ষমাণ', 'Confirmed': 'নিশ্চিত', 'Preparing': 'তৈরি হচ্ছে', 'Ready': 'প্রস্তুত',
    'Out for delivery': 'ডেলিভারির পথে', 'Completed': 'সম্পন্ন', 'Cancelled': 'বাতিল', 'Username': 'ব্যবহারকারীর নাম',
    'Password': 'পাসওয়ার্ড', 'Password confirmation': 'পাসওয়ার্ড নিশ্চিত করুন', 'Email address': 'ইমেইল ঠিকানা',
    'Search food...': 'খাবার খুঁজুন...', 'Search food': 'খাবার খুঁজুন', 'Map showing Taza outlets': 'তাজার আউটলেটের মানচিত্র',
    'Taza Food Corner home': 'তাজা ফুড কর্নার হোম', 'Toggle interface labels between English and Bangla': 'ইংরেজি ও বাংলার ভাষা বদলান',
    'Close menu': 'মেনু বন্ধ করুন', 'Send message': 'বার্তা পাঠান', 'Remove item from cart': 'কার্ট থেকে খাবার সরান',
    'Add to cart': 'কার্টে যোগ করুন', 'COPIED ✓': 'কপি হয়েছে ✓',
    'Map could not load. You can still select an outlet from the list.': 'মানচিত্র লোড হয়নি। তালিকা থেকে আউটলেট বেছে নিতে পারবেন।',
    'TAZA OUTLET': 'তাজা আউটলেট', 'km away': 'কিমি দূরে', 'Select this outlet →': 'এই আউটলেট বেছে নিন →',
    'DEMO LOCATION · REPLACE IN ADMIN': 'নমুনা অবস্থান · অ্যাডমিনে আসল তথ্য দিন',
    'No outlets found in this radius. Increase the search radius or view all outlets.': 'এই দূরত্বে কোনো আউটলেট নেই। দূরত্ব বাড়ান বা সব আউটলেট দেখুন।',
    'Could not retrieve outlets.': 'আউটলেটের তথ্য আনা যায়নি।',
    'Could not refresh nearby outlets. The default list remains available; check your internet connection and try again.': 'কাছের আউটলেট হালনাগাদ করা যায়নি। আগের তালিকা আছে; ইন্টারনেট দেখে আবার চেষ্টা করুন।',
    'Your browser does not support location access. Choose an outlet manually from the list.': 'আপনার ব্রাউজারে অবস্থান সেবা নেই। তালিকা থেকে নিজে আউটলেট বেছে নিন।',
    'Finding you…': 'আপনার অবস্থান খোঁজা হচ্ছে…', 'Waiting for browser location permission…': 'ব্রাউজারের অবস্থান অনুমতির অপেক্ষায়…',
    'Location found ✓': 'অবস্থান পাওয়া গেছে ✓', 'Try location again ↗': 'আবার অবস্থান খুঁজুন ↗',
    'Location permission was denied. You can still select an outlet manually from the list.': 'অবস্থানের অনুমতি দেওয়া হয়নি। তালিকা থেকে নিজে আউটলেট বেছে নিতে পারবেন।',
    'Your location is unavailable. Check device location settings or select manually.': 'আপনার অবস্থান পাওয়া যাচ্ছে না। ডিভাইসের সেটিংস দেখুন অথবা নিজে বেছে নিন।',
    'The location request timed out. Try again or select an outlet manually.': 'অবস্থানের অনুরোধের সময় শেষ হয়েছে। আবার চেষ্টা করুন অথবা নিজে বেছে নিন।',
    'Could not get your location. Select an outlet manually.': 'আপনার অবস্থান পাওয়া যায়নি। তালিকা থেকে আউটলেট বেছে নিন।',
    'Location found. Showing outlets within': 'অবস্থান পাওয়া গেছে।', 'km of your current position.': 'কিমি ব্যাসার্ধের আউটলেট দেখানো হচ্ছে।',
    'Sign In | TAZA FOOD CORNER': 'সাইন ইন | তাজা ফুড কর্নার', 'Create Account | TAZA FOOD CORNER': 'অ্যাকাউন্ট তৈরি | তাজা ফুড কর্নার',
    'Staff Dashboard | TAZA FOOD CORNER': 'কর্মী ড্যাশবোর্ড | তাজা ফুড কর্নার', 'Delivery Dashboard | TAZA FOOD CORNER': 'ডেলিভারি ড্যাশবোর্ড | তাজা ফুড কর্নার',
    'For the demo project, add your real customer care number in the Outlet records or update this page before publishing.': 'ডেমো প্রকল্পে, প্রকাশের আগে আউটলেটের তথ্য থেকে আসল কাস্টমার কেয়ার নম্বর যোগ করুন অথবা এই পৃষ্ঠা হালনাগাদ করুন।',
    'Use the feedback page to send a note or share your experience with the Taza team.': 'মতামত পৃষ্ঠা থেকে তাজা টিমকে বার্তা পাঠান বা আপনার অভিজ্ঞতা জানান।',
    'GOOD TO SEE YOU AGAIN': 'আবার দেখে ভালো লাগছে', 'Your Taza': 'তাজার সঙ্গে আপনার', 'journey': 'যাত্রা', 'continues.': 'চলছে।',
    'Sign in to check your orders and make your next craving happen.': 'অর্ডার দেখতে এবং পরের পছন্দের খাবার পেতে সাইন ইন করুন।',
    'WELCOME BACK': 'আবার স্বাগতম', 'Sign ': 'সাইন ', 'in.': 'ইন করুন।', 'New to Taza?': 'তাজায় নতুন?', 'Create an account': 'অ্যাকাউন্ট তৈরি করুন',
    'No active delivery orders.': 'এখন কোনো ডেলিভারি অর্ডার নেই।', 'No orders to display.': 'দেখানোর মতো কোনো অর্ডার নেই।',
    'TAZA FOOD CORNER | Fresh food, happy moments': 'তাজা ফুড কর্নার | সতেজ খাবার, আনন্দের মুহূর্ত',
    'Your Cart | TAZA FOOD CORNER': 'আপনার কার্ট | তাজা ফুড কর্নার', 'Checkout | TAZA FOOD CORNER': 'চেকআউট | তাজা ফুড কর্নার',
    'Menu | TAZA FOOD CORNER': 'মেনু | তাজা ফুড কর্নার', 'Offers | TAZA FOOD CORNER': 'অফার | তাজা ফুড কর্নার',
    'Coupons | TAZA FOOD CORNER': 'কুপন | তাজা ফুড কর্নার', 'Find an Outlet | TAZA FOOD CORNER': 'আউটলেট খুঁজুন | তাজা ফুড কর্নার',
    'Contact Us | TAZA FOOD CORNER': 'যোগাযোগ | তাজা ফুড কর্নার', 'Feedback | TAZA FOOD CORNER': 'মতামত | তাজা ফুড কর্নার',
    'FAQ | TAZA FOOD CORNER': 'সাধারণ জিজ্ঞাসা | তাজা ফুড কর্নার', 'About | TAZA FOOD CORNER': 'আমাদের সম্পর্কে | তাজা ফুড কর্নার',
    'Order History | TAZA FOOD CORNER': 'অর্ডারের ইতিহাস | তাজা ফুড কর্নার', 'Payment Options | TAZA FOOD CORNER': 'পেমেন্টের ধরন | তাজা ফুড কর্নার',
    'Order Confirmed | TAZA FOOD CORNER': 'অর্ডার নিশ্চিত | তাজা ফুড কর্নার', 'Outlet Opening Hours | TAZA FOOD CORNER': 'আউটলেট খোলার সময় | তাজা ফুড কর্নার',
    'FIRST ORDER OFFER': 'প্রথম অর্ডারে ছাড়', 'FAMILY TIME': 'পরিবারের সঙ্গে', 'TAZA FAVOURITE': 'তাজার বিশেষ পছন্দ', 'CURRENT OFFER': 'চলতি অফার',
    'PERCENT DISCOUNT': 'শতাংশ ছাড়', 'FIXED AMOUNT DISCOUNT': 'নির্দিষ্ট অঙ্কের ছাড়',
    'Taza Classic Burger': 'তাজা ক্লাসিক বার্গার', 'Double Cheese Burger': 'ডাবল চিজ বার্গার', 'Spicy Chicken Pizza': 'স্পাইসি চিকেন পিৎজা',
    'Classic Cheese Pizza': 'ক্লাসিক চিজ পিৎজা', 'Crispy Fried Chicken': 'ক্রিসপি ফ্রাইড চিকেন', 'Chicken Strips': 'চিকেন স্ট্রিপস',
    'Taza Chicken Biryani': 'তাজা চিকেন বিরিয়ানি', 'Beef Tehari': 'বিফ তেহারি', 'Fresh Lime': 'ফ্রেশ লাইম', 'Cold Coffee': 'কোল্ড কফি',
    'Chocolate Brownie': 'চকলেট ব্রাউনি', 'Vanilla Ice Cream': 'ভ্যানিলা আইসক্রিম', 'Burgers': 'বার্গার', 'Pizza': 'পিৎজা',
    'Fried Chicken': 'ফ্রাইড চিকেন', 'Rice & Meals': 'ভাত ও খাবার', 'Drinks': 'পানীয়', 'Desserts': 'ডেজার্ট',
    '10% off your first order': 'প্রথম অর্ডারে ১০% ছাড়', '15% off a family meal': 'পারিবারিক খাবারে ১৫% ছাড়', '৳50 off orders over ৳500': '৳৫০০-এর বেশি অর্ডারে ৳৫০ ছাড়',
    'Weather is not configured. Set OPENWEATHER_API_KEY.': 'আবহাওয়ার সেবা সেটআপ করা হয়নি। OPENWEATHER_API_KEY যোগ করুন।',
    'Weather provider rejected the request.': 'আবহাওয়ার সেবা অনুরোধটি গ্রহণ করেনি।', 'Weather service is temporarily unavailable.': 'আবহাওয়ার সেবা এই মুহূর্তে পাওয়া যাচ্ছে না।',
    'Location is not supported by this browser.': 'এই ব্রাউজারে অবস্থান সেবা সমর্থিত নয়।', 'Finding your location…': 'আপনার অবস্থান খোঁজা হচ্ছে…',
    'Location timed out. Showing Chattogram.': 'অবস্থান পেতে দেরি হচ্ছে। চট্টগ্রামের আবহাওয়া দেখানো হচ্ছে।', 'Location unavailable. Showing Chattogram.': 'অবস্থান পাওয়া যায়নি। চট্টগ্রামের আবহাওয়া দেখানো হচ্ছে।',
    'Chat is not configured. Set GROQ_API_KEY.': 'চ্যাট সেবা সেটআপ করা হয়নি। GROQ_API_KEY যোগ করুন।',
    'Groq rejected this API key or its model access. Check the key and enabled models.': 'Groq API কী বা মডেল অনুমোদন করেনি। কী ও চালু মডেল পরীক্ষা করুন।',
    'The configured Groq model is unavailable. Choose a model enabled for this API key.': 'নির্বাচিত Groq মডেলটি পাওয়া যাচ্ছে না। এই API কী-তে চালু মডেল বেছে নিন।',
    'The Groq service is rate-limited right now. Please try again shortly.': 'Groq সেবায় অনুরোধের সীমা পূর্ণ হয়েছে। একটু পর আবার চেষ্টা করুন।',
    'The chat service could not answer right now. Please try again shortly.': 'চ্যাট সেবা এখন উত্তর দিতে পারছে না। একটু পর আবার চেষ্টা করুন।',
    'The chat service is temporarily unavailable.': 'চ্যাট সেবা এই মুহূর্তে পাওয়া যাচ্ছে না।',
    'Too many messages. Please wait a minute and try again.': 'অনেক বার্তা পাঠানো হয়েছে। এক মিনিট অপেক্ষা করে আবার চেষ্টা করুন।',
    'Clear sky': 'পরিষ্কার আকাশ', 'few clouds': 'হালকা মেঘ', 'scattered clouds': 'বিক্ষিপ্ত মেঘ', 'broken clouds': 'ঘন মেঘ',
    'overcast clouds': 'মেঘাচ্ছন্ন আকাশ', 'light rain': 'হালকা বৃষ্টি', 'moderate rain': 'মাঝারি বৃষ্টি', 'heavy intensity rain': 'ভারী বৃষ্টি',
    'A grilled chicken patty with fresh lettuce and house sauce.': 'গ্রিল করা চিকেন প্যাটি, টাটকা লেটুস ও বিশেষ সস দিয়ে তৈরি।',
    'Double layers of chicken and melted cheese.': 'দুই স্তর চিকেন ও গলানো চিজ।', 'A shareable pizza with spicy chicken and cheese.': 'ঝাল চিকেন ও চিজের পিৎজা—সবার সঙ্গে ভাগ করে খাওয়ার জন্য।',
    'A classic cheese pizza with a crisp crust.': 'মুচমুচে ক্রাস্টের ক্লাসিক চিজ পিৎজা।', 'Golden crispy chicken pieces, freshly prepared.': 'তাজা রান্না করা সোনালি মুচমুচে চিকেন।',
    'Crunchy chicken strips with dipping sauce.': 'ডিপিং সসসহ মুচমুচে চিকেন স্ট্রিপস।', 'Fragrant rice served with a tender chicken piece.': 'সুগন্ধি ভাতের সঙ্গে নরম চিকেন।',
    'Traditional-style beef tehari with aromatic spices.': 'সুগন্ধি মসলায় তৈরি ঐতিহ্যবাহী বিফ তেহারি।', 'A chilled citrus drink.': 'ঠান্ডা লেবুর পানীয়।',
    'Creamy iced coffee.': 'ক্রিমি ঠান্ডা কফি।', 'A rich chocolate brownie.': 'চকলেটে ভরপুর ব্রাউনি।', 'Smooth vanilla ice cream.': 'মসৃণ ভ্যানিলা আইসক্রিম।',
    'piece': 'টি', 'pieces': 'পিস', 'plate': 'প্লেট', '10 inch': '১০ ইঞ্চি', 'glass': 'গ্লাস', 'scoop': 'স্কুপ',
    'Weather is unavailable.': 'আবহাওয়ার তথ্য পাওয়া যাচ্ছে না।', 'Could not reach the assistant. Please try again.': 'সহকারীর সঙ্গে যোগাযোগ করা যায়নি। আবার চেষ্টা করুন।',
  });
  const savedTheme = localStorage.getItem('taza-theme');
  if (savedTheme === 'dark') root.setAttribute('data-theme', 'dark');
  const languageButton = document.querySelector('[data-language-toggle]');
  function replaceText(element, value) {
    const textNode = Array.from(element.childNodes).find((child) => child.nodeType === Node.TEXT_NODE && child.nodeValue.trim());
    if (!element.children.length) {
      element.textContent = value;
    } else if (textNode) {
      const leading = textNode.nodeValue.match(/^\s*/)[0];
      const trailing = textNode.nodeValue.match(/\s*$/)[0];
      textNode.nodeValue = `${leading}${value}${trailing}`;
    }
  }

  function translateText(value, dictionary) {
    const phrase = value.trim();
    if (dictionary[phrase]) return value.replace(phrase, dictionary[phrase]);
    let translated = value;
    Object.keys(dictionary).filter((key) => key.length >= 5).sort((a, b) => b.length - a.length).forEach((key) => {
      if (translated.includes(key)) translated = translated.split(key).join(dictionary[key]);
    });
    return translated;
  }

  function applyLanguage(language) {
    document.querySelectorAll('[data-en][data-bn]').forEach((node) => {
      replaceText(node, language === 'bn' ? node.dataset.bn : node.dataset.en);
    });
    const dictionary = language === 'bn' ? bnText : Object.fromEntries(Object.entries(bnText).map(([english, bangla]) => [bangla, english]));
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      node.nodeValue = translateText(node.nodeValue, dictionary);
    }
    document.querySelectorAll('[placeholder], [title], [aria-label]').forEach((node) => {
      ['placeholder', 'title', 'aria-label'].forEach((attribute) => {
        const value = node.getAttribute(attribute);
        if (value && dictionary[value]) node.setAttribute(attribute, dictionary[value]);
      });
    });
    root.lang = language;
    const originalTitle = root.dataset.originalTitle || document.title;
    root.dataset.originalTitle = originalTitle;
    document.title = language === 'bn' ? (bnText[originalTitle] || 'তাজা ফুড কর্নার') : originalTitle;
    const enText = Object.fromEntries(Object.entries(bnText).map(([english, bangla]) => [bangla, english]));
    window.tazaTranslate = (text) => language === 'bn' ? (bnText[text] || text) : (enText[text] || text);
    if (languageButton) languageButton.setAttribute('aria-label', language === 'bn' ? 'ইন্টারফেস ইংরেজিতে দেখুন' : 'ইন্টারফেস বাংলায় দেখুন');
    localStorage.setItem('taza-language', language);
    window.dispatchEvent(new CustomEvent('taza-language-change', { detail: { language } }));
  }
  const savedLanguage = localStorage.getItem('taza-language');
  if (savedLanguage === 'bn') applyLanguage('bn');
  if (languageButton) languageButton.addEventListener('click', () => {
    const current = localStorage.getItem('taza-language') || 'en';
    applyLanguage(current === 'bn' ? 'en' : 'bn');
  });

  const themeButton = document.querySelector('.theme-toggle');
  if (themeButton) {
    themeButton.addEventListener('click', function () {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('taza-theme', next);
    });
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const closeMenu = document.querySelector('.close-menu');
  const sideMenu = document.getElementById('sideMenu');
  const scrim = document.getElementById('menuScrim');
  function setMenu(open) {
    if (!sideMenu || !scrim) return;
    sideMenu.classList.toggle('open', open);
    scrim.classList.toggle('show', open);
    sideMenu.setAttribute('aria-hidden', String(!open));
    if (menuToggle) menuToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (menuToggle) menuToggle.addEventListener('click', () => setMenu(true));
  if (closeMenu) closeMenu.addEventListener('click', () => setMenu(false));
  if (scrim) scrim.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

  document.querySelectorAll('.message button').forEach((button) => button.addEventListener('click', () => button.parentElement.remove()));
  document.querySelectorAll('.copy-coupon').forEach((button) => button.addEventListener('click', async () => {
    const code = button.dataset.copy || '';
      try { await navigator.clipboard.writeText(code); button.textContent = window.tazaTranslate ? window.tazaTranslate('COPIED ✓') : 'COPIED ✓'; }
    catch (_) { button.textContent = code; }
  }));
})();
