const Fitness = require('../models/Fitness');
const Food = require('../models/Food');

const tamilNaduFoods = [
    { name: "Soya Chunks (Dry / Meal Maker)", aliases: ["soya chunks", "soy chunks", "meal maker", "soya", "tvp"], kcal: 345, protein: 52, carbs: 33, fibre: 13 },
    { name: "Soya Chunks (Boiled / Cooked)", aliases: ["boiled soya", "cooked soya chunks", "boiled meal maker"], kcal: 120, protein: 18, carbs: 11, fibre: 4.5 },
    { name: "Idli", aliases: ["idli", "idly", "idli sambar"], kcal: 146, protein: 4.5, carbs: 30, fibre: 1.5 },
    { name: "Podi Idli / Ghee Podi Idli", aliases: ["podi idli", "ghee podi idli", "mini idli"], kcal: 195, protein: 5.2, carbs: 31, fibre: 2.0 },
    { name: "Plain Dosa", aliases: ["dosa", "dosai", "plain dosa"], kcal: 168, protein: 3.9, carbs: 29, fibre: 0.9 },
    { name: "Kal Dosa", aliases: ["kal dosa", "kal dosai", "set dosa"], kcal: 155, protein: 4.2, carbs: 28, fibre: 1.1 },
    { name: "Masala Dosa", aliases: ["masala dosa", "masal dosa"], kcal: 210, protein: 4.5, carbs: 32, fibre: 2.0 },
    { name: "Ghee Roast Dosa", aliases: ["ghee roast", "roast dosa", "paper roast", "nei roast"], kcal: 245, protein: 4.0, carbs: 31, fibre: 0.8 },
    { name: "Podi Dosa", aliases: ["podi dosa", "podi dosai", "onion podi dosa"], kcal: 205, protein: 4.8, carbs: 31, fibre: 1.6 },
    { name: "Egg Dosa (Muttai Dosai)", aliases: ["egg dosa", "muttai dosa", "muttai dosai"], kcal: 195, protein: 8.5, carbs: 25, fibre: 0.8 },
    { name: "Madurai Kari Dosa", aliases: ["kari dosa", "kari dosai", "mutton kari dosa", "chicken kari dosa"], kcal: 245, protein: 13.5, carbs: 24, fibre: 1.0 },
    { name: "Rava Dosa", aliases: ["rava dosa", "ravai dosai", "onion rava dosa"], kcal: 195, protein: 3.5, carbs: 28, fibre: 1.2 },
    { name: "Ragi Dosa", aliases: ["ragi dosa", "kezhvaragu dosa", "kelvaragu dosai"], kcal: 135, protein: 3.8, carbs: 26, fibre: 3.5 },
    { name: "Adai Dosa", aliases: ["adai", "adai dosa", "paruppu adai", "adai aviyal"], kcal: 195, protein: 7.5, carbs: 28, fibre: 4.2 },
    { name: "Pesarattu (Green Gram Dosa)", aliases: ["pesarattu", "pachai payaru dosa"], kcal: 160, protein: 6.8, carbs: 24, fibre: 3.8 },
    { name: "Uttapam / Onion Uttapam", aliases: ["uttapam", "oothappam", "onion uttapam"], kcal: 175, protein: 4.3, carbs: 29, fibre: 1.8 },
    { name: "Ven Pongal", aliases: ["pongal", "ven pongal", "kara pongal", "ghee pongal"], kcal: 165, protein: 4.2, carbs: 24, fibre: 1.2 },
    { name: "Sakkarai Pongal (Sweet Pongal)", aliases: ["sakkarai pongal", "sweet pongal"], kcal: 230, protein: 3.5, carbs: 42, fibre: 1.0 },
    { name: "Poori", aliases: ["poori", "puri", "poori masala"], kcal: 295, protein: 5.5, carbs: 35, fibre: 2.0 },
    { name: "Chola Poori (Bhatura)", aliases: ["chola poori", "bhatura", "chole bhature"], kcal: 315, protein: 6.2, carbs: 42, fibre: 2.2 },
    { name: "Chapati / Roti", aliases: ["chapati", "chappathi", "roti", "wheat chapati", "phulka"], kcal: 240, protein: 8.0, carbs: 46, fibre: 6.5 },
    { name: "Parotta", aliases: ["parotta", "barotta", "maida parotta", "bun parotta", "veechu parotta", "coin parotta"], kcal: 320, protein: 6.5, carbs: 45, fibre: 1.5 },
    { name: "Ceylon Egg Parotta", aliases: ["ceylon parotta", "egg veechu parotta", "muttai parotta"], kcal: 275, protein: 9.8, carbs: 34, fibre: 1.2 },
    { name: "Kothu Parotta (Egg / Chicken)", aliases: ["kothu parotta", "egg kothu parotta", "chicken kothu parotta", "mutton kothu parotta"], kcal: 230, protein: 11, carbs: 26, fibre: 1.5 },
    { name: "Chilli Parotta", aliases: ["chilli parotta", "chilly parotta"], kcal: 265, protein: 5.5, carbs: 38, fibre: 1.8 },
    { name: "Wheat Parotta (Godhumai Parotta)", aliases: ["wheat parotta", "godhumai parotta"], kcal: 270, protein: 7.5, carbs: 42, fibre: 4.5 },
    { name: "Idiyappam (String Hoppers)", aliases: ["idiyappam", "sevai", "rice sevai", "lemon sevai", "coconut sevai"], kcal: 150, protein: 3.0, carbs: 33, fibre: 1.2 },
    { name: "Appam", aliases: ["appam", "aappam", "thengai paal appam"], kcal: 140, protein: 2.8, carbs: 29, fibre: 0.8 },
    { name: "Puttu", aliases: ["puttu", "arisi puttu", "ragi puttu", "wheat puttu", "red rice puttu"], kcal: 190, protein: 3.5, carbs: 38, fibre: 2.2 },
    { name: "Rava Upma / Kichadi", aliases: ["upma", "rava upma", "kichadi", "rava kichadi", "semiya upma"], kcal: 132, protein: 3.2, carbs: 22, fibre: 1.4 },
    { name: "Aval Upma / Poha (Flattened Rice)", aliases: ["aval", "poha", "aval upma", "red aval", "sigappu aval"], kcal: 158, protein: 3.2, carbs: 32, fibre: 2.0 },
    { name: "Kuzhi Paniyaram", aliases: ["paniyaram", "kuzhi paniyaram", "kara paniyaram", "sweet paniyaram"], kcal: 175, protein: 4.0, carbs: 28, fibre: 1.5 },
    { name: "Ragi Koozh / Kali", aliases: ["ragi koozh", "kezhvaragu koozh", "koozh", "ragi porridge", "ragi kali", "kezhvaragu kali"], kcal: 85, protein: 2.4, carbs: 18, fibre: 2.8 },
    { name: "Kambu Koozh (Pearl Millet)", aliases: ["kambu koozh", "kambu", "kambu sadam", "bajra"], kcal: 70, protein: 2.2, carbs: 14, fibre: 1.8 },
    { name: "Ulundhu Kali / Karupatti Kali", aliases: ["ulundhu kali", "ulundu kali", "karupatti kali"], kcal: 215, protein: 7.5, carbs: 34, fibre: 3.2 },
    { name: "White Rice (Cooked / Soru)", aliases: ["rice", "white rice", "cooked rice", "soru", "sadam"], kcal: 130, protein: 2.7, carbs: 28, fibre: 0.4 },
    { name: "Ponni Boiled Rice (Cooked)", aliases: ["ponni rice", "boiled rice", "puzhungal arisi"], kcal: 125, protein: 2.9, carbs: 27, fibre: 0.8 },
    { name: "Brown / Red / Karuppu Kavuni Rice (Cooked)", aliases: ["brown rice", "hand pound rice", "mapillai samba", "karuppu kavuni", "red rice", "matta rice"], kcal: 112, protein: 2.6, carbs: 23, fibre: 1.8 },
    { name: "Thinai / Samai / Varagu / Kuthiraivali Millet Rice", aliases: ["thinai", "samai", "varagu", "kuthiraivali", "millet", "millet rice", "foxtail millet", "little millet"], kcal: 118, protein: 3.8, carbs: 22, fibre: 2.9 },
    { name: "Sambar Sadam (Sambar Rice)", aliases: ["sambar sadam", "sambar rice", "bisibelebath"], kcal: 135, protein: 4.2, carbs: 23, fibre: 2.5 },
    { name: "Curd Rice (Thayir Sadam)", aliases: ["curd rice", "thayir sadam", "daddojanam", "pazhaya soru", "pazhaya sadam"], kcal: 115, protein: 3.5, carbs: 19, fibre: 0.5 },
    { name: "Lemon Rice (Elumichai Sadam)", aliases: ["lemon rice", "elumichai sadam"], kcal: 175, protein: 3.2, carbs: 28, fibre: 1.2 },
    { name: "Tomato Rice (Thakkali Sadam)", aliases: ["tomato rice", "thakkali sadam", "thakkali soru"], kcal: 160, protein: 3.0, carbs: 26, fibre: 1.5 },
    { name: "Tamarind Rice (Puliyodharai)", aliases: ["tamarind rice", "puliyodharai", "puli sadam", "puliyogare"], kcal: 185, protein: 3.5, carbs: 30, fibre: 1.8 },
    { name: "Coconut Rice (Thengai Sadam)", aliases: ["coconut rice", "thengai sadam"], kcal: 210, protein: 3.4, carbs: 27, fibre: 2.2 },
    { name: "Pudina / Malli Sadam (Mint / Coriander Rice)", aliases: ["pudina rice", "mint rice", "coriander rice", "malli sadam", "karuveppilai sadam"], kcal: 155, protein: 3.1, carbs: 26, fibre: 2.0 },
    { name: "Ghee Rice / Nei Soru / Kuska", aliases: ["ghee rice", "nei soru", "kuska", "plain biryani"], kcal: 190, protein: 3.5, carbs: 29, fibre: 0.8 },
    { name: "Chicken Biryani", aliases: ["chicken biryani", "biryani", "ambur biryani", "dindigul biryani", "chicken biriyani", "thalappakatti biryani", "hyderabadi biryani"], kcal: 195, protein: 11, carbs: 22, fibre: 1.2 },
    { name: "Mutton Biryani", aliases: ["mutton biryani", "mutton biriyani", "beef biryani"], kcal: 225, protein: 10.5, carbs: 21, fibre: 1.2 },
    { name: "Egg Biryani", aliases: ["egg biryani", "muttai biryani", "egg biriyani"], kcal: 175, protein: 7.5, carbs: 23, fibre: 1.2 },
    { name: "Veg Biryani / Mushroom / Paneer Biryani", aliases: ["veg biryani", "mushroom biryani", "paneer biryani", "soya biryani"], kcal: 155, protein: 4.5, carbs: 25, fibre: 2.2 },
    { name: "Chicken Fried Rice (Fast Food Style)", aliases: ["chicken fried rice", "fried rice", "chicken rice", "schezwan chicken fried rice"], kcal: 195, protein: 9.2, carbs: 25, fibre: 1.2 },
    { name: "Egg Fried Rice (Fast Food Style)", aliases: ["egg fried rice", "muttai fried rice", "egg rice"], kcal: 180, protein: 6.8, carbs: 26, fibre: 1.0 },
    { name: "Veg / Mushroom / Paneer Fried Rice", aliases: ["veg fried rice", "mushroom fried rice", "paneer fried rice", "gobi fried rice"], kcal: 165, protein: 4.2, carbs: 27, fibre: 1.8 },
    { name: "Chicken Noodles (Fast Food Style)", aliases: ["chicken noodles", "noodles", "schezwan chicken noodles", "hakka noodles"], kcal: 205, protein: 8.8, carbs: 26, fibre: 1.5 },
    { name: "Egg Noodles (Fast Food Style)", aliases: ["egg noodles", "muttai noodles"], kcal: 190, protein: 6.5, carbs: 27, fibre: 1.3 },
    { name: "Veg / Gobi / Mushroom Noodles", aliases: ["veg noodles", "gobi noodles", "mushroom noodles", "paneer noodles"], kcal: 175, protein: 4.0, carbs: 28, fibre: 1.8 },
    { name: "Maggi / Instant Noodles (Cooked)", aliases: ["maggi", "maggie", "yippee", "top ramen", "instant noodles", "egg maggi"], kcal: 188, protein: 4.5, carbs: 27, fibre: 1.2 },
    { name: "Burmese Atho (Veg / Egg / Chicken)", aliases: ["atho", "chicken atho", "egg atho", "veg atho", "banga", "mohinga"], kcal: 210, protein: 7.5, carbs: 29, fibre: 2.0 },
    { name: "Chicken Shawarma Roll", aliases: ["shawarma", "chicken shawarma", "shawarma roll", "mexican shawarma"], kcal: 235, protein: 14.5, carbs: 21, fibre: 1.2 },
    { name: "Plate Shawarma", aliases: ["plate shawarma", "chicken plate shawarma", "special shawarma"], kcal: 250, protein: 17.0, carbs: 18, fibre: 1.5 },
    { name: "Chicken Roll / Frankie / Kathi Roll", aliases: ["chicken roll", "egg roll", "paneer roll", "frankie", "chicken wrap"], kcal: 225, protein: 11.5, carbs: 26, fibre: 1.5 },
    { name: "Bread Omelette (Street Style)", aliases: ["bread omelette", "bread omlet", "cheese bread omelette", "chicken bread omelette"], kcal: 220, protein: 10.5, carbs: 21, fibre: 1.2 },
    { name: "Gobi 65 / Cauliflower Chilli", aliases: ["gobi 65", "cauliflower chilli", "chilli gobi", "cauliflower 65", "gobi manchurian", "cauliflower pakoda"], kcal: 215, protein: 3.8, carbs: 19, fibre: 2.5 },
    { name: "Mushroom 65 / Chilli Mushroom", aliases: ["mushroom 65", "chilli mushroom", "mushroom manchurian", "kaalan 65"], kcal: 195, protein: 4.2, carbs: 17, fibre: 2.0 },
    { name: "Roadside Kalan Masala (Mushroom Chat)", aliases: ["kalan", "kaalan", "roadside kalan", "kalan masala", "mushroom masala chat"], kcal: 165, protein: 4.0, carbs: 18, fibre: 2.2 },
    { name: "Paneer 65 / Chilli Paneer / Paneer Manchurian", aliases: ["paneer 65", "chilli paneer", "paneer manchurian"], kcal: 275, protein: 14.5, carbs: 12, fibre: 1.0 },
    { name: "Chicken Manchurian / Chilli Chicken", aliases: ["chicken manchurian", "chilli chicken", "dragon chicken", "garlic chicken", "pepper chicken"], kcal: 230, protein: 18.5, carbs: 10, fibre: 0.8 },
    { name: "Chicken Lollipop / Wings", aliases: ["chicken lollipop", "lollipop", "chicken wings", "peri peri wings", "crab lollipop"], kcal: 255, protein: 19.5, carbs: 9.5, fibre: 0.5 },
    { name: "Fried Chicken (KFC / Broasted Style)", aliases: ["kfc", "kfc chicken", "fried chicken", "broasted chicken", "chicken popcorn", "crispy chicken"], kcal: 290, protein: 20.0, carbs: 13, fibre: 0.6 },
    { name: "Chicken Burger / Zinger Burger", aliases: ["burger", "chicken burger", "zinger burger", "veg burger", "cheese burger"], kcal: 265, protein: 13.0, carbs: 28, fibre: 1.5 },
    { name: "Pizza (Cheese / Chicken / Veg)", aliases: ["pizza", "cheese pizza", "chicken pizza", "margherita pizza", "dominos pizza"], kcal: 266, protein: 11.0, carbs: 33, fibre: 2.3 },
    { name: "Sandwich (Veg / Cheese / Chicken Grilled)", aliases: ["sandwich", "veg sandwich", "cheese sandwich", "chicken sandwich", "grilled sandwich", "paneer sandwich", "club sandwich"], kcal: 230, protein: 8.5, carbs: 29, fibre: 2.0 },
    { name: "French Fries", aliases: ["french fries", "fries", "peri peri fries", "potato fries"], kcal: 312, protein: 3.4, carbs: 41, fibre: 3.8 },
    { name: "Momos (Steamed / Fried Chicken & Veg)", aliases: ["momos", "chicken momos", "veg momos", "fried momos", "steamed momos"], kcal: 195, protein: 8.5, carbs: 26, fibre: 1.5 },
    { name: "Pani Puri / Golgappa", aliases: ["pani puri", "paani poori", "golgappa", "masala puri", "dahi puri", "bhel puri", "sev puri"], kcal: 215, protein: 4.5, carbs: 32, fibre: 2.8 },
    { name: "Pav Bhaji", aliases: ["pav bhaji", "vada pav"], kcal: 240, protein: 5.5, carbs: 34, fibre: 3.0 },
    { name: "Sweet Corn (Boiled / Masala Corn)", aliases: ["sweet corn", "corn", "masala corn", "boiled corn", "makka cholam"], kcal: 96, protein: 3.4, carbs: 21, fibre: 2.4 },
    { name: "Sambar", aliases: ["sambar", "tiffin sambar", "arachuvitta sambar"], kcal: 65, protein: 3.2, carbs: 9.5, fibre: 2.8 },
    { name: "Rasam", aliases: ["rasam", "thakkali rasam", "milagu rasam", "paruppu rasam"], kcal: 25, protein: 0.8, carbs: 4.5, fibre: 0.6 },
    { name: "Dal / Paruppu (Cooked)", aliases: ["dal", "paruppu", "toor dal", "moong dal", "pasi paruppu"], kcal: 116, protein: 9.0, carbs: 20, fibre: 4.0 },
    { name: "Vegetable Poriyal", aliases: ["poriyal", "beans poriyal", "cabbage poriyal", "carrot poriyal", "vendakkai poriyal", "potato poriyal", "beetroot poriyal", "vazhaikkai poriyal"], kcal: 85, protein: 2.2, carbs: 10, fibre: 3.5 },
    { name: "Kootu", aliases: ["kootu", "chow chow kootu", "pudalangai kootu", "keerai kootu", "sorakkai kootu"], kcal: 95, protein: 4.0, carbs: 12, fibre: 3.2 },
    { name: "Keerai Masiyal (Spinach)", aliases: ["keerai", "spinach", "keerai masiyal", "keerai poriyal", "arai keerai", "siru keerai", "murungai keerai", "ponnanganni keerai"], kcal: 55, protein: 3.5, carbs: 6.0, fibre: 3.8 },
    { name: "Aviyal", aliases: ["aviyal", "avial"], kcal: 110, protein: 2.5, carbs: 10, fibre: 3.0 },
    { name: "Kara Kuzhambu / Vatha Kuzhambu", aliases: ["kara kuzhambu", "vatha kuzhambu", "puli kuzhambu", "enna kathirikai", "mor kuzhambu"], kcal: 90, protein: 1.8, carbs: 11, fibre: 2.0 },
    { name: "Kurma (Veg / White Kurma / Salna)", aliases: ["kurma", "veg kurma", "salna", "parotta salna", "empty salna", "chicken salna"], kcal: 135, protein: 3.2, carbs: 10, fibre: 2.2 },
    { name: "Chicken Breast (Boiled / Cooked)", aliases: ["chicken breast", "boiled chicken", "chicken", "cooked chicken"], kcal: 165, protein: 31, carbs: 0, fibre: 0 },
    { name: "Chicken Curry / Kulambu", aliases: ["chicken curry", "chicken kulambu", "chicken gravy", "koli kulambu", "pallipalayam chicken", "chettinad chicken", "chicken chukka"], kcal: 145, protein: 16, carbs: 4.5, fibre: 0.8 },
    { name: "Chicken 65", aliases: ["chicken 65", "boneless chicken 65"], kcal: 260, protein: 21, carbs: 8.0, fibre: 0.5 },
    { name: "Grilled / Tandoori Chicken", aliases: ["grilled chicken", "tandoori chicken", "al faham", "alfaham", "bbq chicken"], kcal: 195, protein: 27, carbs: 2.0, fibre: 0.5 },
    { name: "Mutton Curry / Sukka", aliases: ["mutton", "mutton curry", "mutton kulambu", "mutton sukka", "mutton chukka", "udal", "boti", "kudal kulambu"], kcal: 215, protein: 20, carbs: 4.0, fibre: 0.5 },
    { name: "Beef Sukka / Chilli Beef", aliases: ["beef", "beef fry", "beef sukka", "chilli beef", "beef curry"], kcal: 225, protein: 24, carbs: 4.5, fibre: 0.5 },
    { name: "Fish Curry (Meen Kuzhambu)", aliases: ["fish curry", "meen kuzhambu", "meen kulambu"], kcal: 125, protein: 15, carbs: 4.0, fibre: 0.6 },
    { name: "Fish Fry (Meen Varuval)", aliases: ["fish fry", "meen varuval", "vanjiram fry", "fish", "nethili fry"], kcal: 210, protein: 22, carbs: 3.5, fibre: 0.5 },
    { name: "Prawn / Eral Masala", aliases: ["prawn", "eral", "prawns", "eral thokku", "prawn fry", "chilli prawn"], kcal: 135, protein: 20, carbs: 3.0, fibre: 0.4 },
    { name: "Crab Masala (Nandu Gravy)", aliases: ["crab", "nandu", "nandu masala", "crab soup", "nandu rasam"], kcal: 110, protein: 18, carbs: 2.0, fibre: 0.2 },
    { name: "Karuvadu Thokku (Dry Fish)", aliases: ["karuvadu", "dry fish", "nethili karuvadu", "karuvadu thokku"], kcal: 245, protein: 42, carbs: 3.0, fibre: 0.5 },
    { name: "Boiled Egg (Whole)", aliases: ["egg", "boiled egg", "whole egg", "muttai", "avicha muttai"], kcal: 155, protein: 12.6, carbs: 1.1, fibre: 0 },
    { name: "Egg White (Boiled)", aliases: ["egg white", "egg whites", "muttai vellai"], kcal: 52, protein: 10.9, carbs: 0.7, fibre: 0 },
    { name: "Egg Omelette / Kalakki", aliases: ["omelette", "egg omelette", "omlet", "muttai omelette", "kalakki", "off boil", "half boil", "full boil"], kcal: 185, protein: 13, carbs: 1.5, fibre: 0.2 },
    { name: "Egg Podimas / Bhurji", aliases: ["egg podimas", "muttai podimas", "egg bhurji", "scrambled egg"], kcal: 170, protein: 12, carbs: 3.0, fibre: 0.5 },
    { name: "Egg Masala / Muttai Kulambu", aliases: ["egg masala", "muttai kulambu", "egg curry", "muttai thokku"], kcal: 145, protein: 9.5, carbs: 6.0, fibre: 1.0 },
    { name: "Paneer (Cottage Cheese)", aliases: ["paneer", "paneer butter masala", "paneer tikka", "palak paneer"], kcal: 265, protein: 18.3, carbs: 3.5, fibre: 0 },
    { name: "Tofu (Soya Paneer)", aliases: ["tofu", "soya paneer"], kcal: 144, protein: 15.5, carbs: 3.0, fibre: 1.2 },
    { name: "Mushroom Masala / Pepper Fry", aliases: ["mushroom", "mushroom gravy", "mushroom pepper fry"], kcal: 95, protein: 3.5, carbs: 8.0, fibre: 2.2 },
    { name: "Black Channa / Kondakadalai (Boiled)", aliases: ["channa", "black channa", "kondakadalai", "chickpeas", "white channa", "chole"], kcal: 164, protein: 8.9, carbs: 27, fibre: 7.6 },
    { name: "Green Gram / Pachai Payaru (Boiled)", aliases: ["green gram", "pachai payaru", "moong sprouts", "sprouts"], kcal: 105, protein: 7.0, carbs: 19, fibre: 7.6 },
    { name: "Kollu (Horse Gram Boiled / Sundal)", aliases: ["kollu", "horse gram", "kollu sundal", "kollu rasam", "kollu paruppu"], kcal: 135, protein: 8.5, carbs: 22, fibre: 5.5 },
    { name: "Karamani / Thatta Payaru (Black Eyed Peas)", aliases: ["karamani", "thatta payaru", "cowpea", "karamani sundal"], kcal: 116, protein: 7.7, carbs: 21, fibre: 6.5 },
    { name: "Sundal", aliases: ["sundal", "pattani sundal", "kadalai sundal", "navaratri sundal", "beach sundal", "thengai maanga pattani sundal"], kcal: 145, protein: 7.5, carbs: 22, fibre: 6.0 },
    { name: "Rajma (Kidney Beans Boiled)", aliases: ["rajma", "kidney beans"], kcal: 127, protein: 8.7, carbs: 22.8, fibre: 6.4 },
    { name: "Peanuts / Verkadalai", aliases: ["peanuts", "verkadalai", "groundnut", "boiled peanuts"], kcal: 567, protein: 25.8, carbs: 16, fibre: 8.5 },
    { name: "Boiled Peanuts (Avicha Verkadalai)", aliases: ["avicha verkadalai", "boiled groundnut"], kcal: 318, protein: 13.5, carbs: 21, fibre: 8.8 },
    { name: "Peanut Butter", aliases: ["peanut butter"], kcal: 588, protein: 25, carbs: 20, fibre: 6.0 },
    { name: "Roasted Gram / Pottukadalai", aliases: ["pottukadalai", "roasted gram", "fried gram", "chutney dal"], kcal: 369, protein: 22.5, carbs: 58, fibre: 16 },
    { name: "Almonds (Badam)", aliases: ["almonds", "badam"], kcal: 579, protein: 21.2, carbs: 21.6, fibre: 12.5 },
    { name: "Cashew Nuts (Mundhiri)", aliases: ["cashew", "cashews", "mundhiri"], kcal: 553, protein: 18.2, carbs: 30, fibre: 3.3 },
    { name: "Walnuts / Pista / Figs / Dry Fruits", aliases: ["walnut", "walnuts", "pista", "pistachio", "fig", "athipazham", "raisins", "ular drakshai", "dry fruits"], kcal: 540, protein: 15.0, carbs: 32, fibre: 7.0 },
    { name: "Dates (Perichampazham)", aliases: ["dates", "perichampazham", "khajoor"], kcal: 282, protein: 2.5, carbs: 75, fibre: 8.0 },
    { name: "Oats", aliases: ["oats", "oatmeal", "rolled oats", "masala oats"], kcal: 389, protein: 16.9, carbs: 66, fibre: 10.6 },
    { name: "Corn Flakes / Muesli / Chocos", aliases: ["corn flakes", "cornflakes", "muesli", "chocos", "kelloggs"], kcal: 375, protein: 8.0, carbs: 80, fibre: 4.5 },
    { name: "White Bread / Brown Bread / Wheat Bread", aliases: ["bread", "white bread", "brown bread", "wheat bread", "milk bread", " bread toast"], kcal: 265, protein: 8.8, carbs: 49, fibre: 3.5 },
    { name: "Bun Butter Jam", aliases: ["bun butter jam", "bun", "butter bun", "cream bun", "jam bun", "thengai bun"], kcal: 345, protein: 6.0, carbs: 52, fibre: 1.5 },
    { name: "Egg Puff (Bakery Muttai Puff)", aliases: ["egg puff", "muttai puff", "muttai puffs", "puffs"], kcal: 360, protein: 9.5, carbs: 34, fibre: 1.5 },
    { name: "Veg Puff / Mushroom / Chicken Puff", aliases: ["veg puff", "mushroom puff", "chicken puff", "paneer puff"], kcal: 375, protein: 6.8, carbs: 39, fibre: 2.0 },
    { name: "Samosa (Onion Patti Samosa / Potato Samosa)", aliases: ["samosa", "onion samosa", "patti samosa", "tea shop samosa", "potato samosa"], kcal: 308, protein: 5.5, carbs: 36, fibre: 2.2 },
    { name: "Medu Vada (Ulundu Vadai)", aliases: ["medu vada", "vadai", "ulundu vadai", "vada", "sambar vadai", "thayir vadai"], kcal: 290, protein: 9.0, carbs: 32, fibre: 3.5 },
    { name: "Masala Vada (Paruppu Vadai / Amai Vadai)", aliases: ["masala vada", "paruppu vadai", "kadalai vadai", "amai vadai", "keerai vadai"], kcal: 310, protein: 10.5, carbs: 35, fibre: 4.5 },
    { name: "Bajji / Bonda / Pakoda", aliases: ["bajji", "bonda", "vazhakkai bajji", "molaga bajji", "onion bajji", "mysore bonda", "urulai bonda", "punugulu", "onion pakoda", "medhu pakoda"], kcal: 285, protein: 5.2, carbs: 34, fibre: 2.4 },
    { name: "pazham Pori (Ethakkappam / Banana Fritter)", aliases: ["pazham pori", "pazhampori", "ethakkappam", "banana bajji"], kcal: 265, protein: 3.2, carbs: 42, fibre: 2.0 },
    { name: "Susiyam / சுசியம் / Suzhiyam", aliases: ["susiyam", "suyyam", "suzhiyam", "kadalai paruppu bonda"], kcal: 295, protein: 6.5, carbs: 46, fibre: 3.0 },
    { name: "Kolukattai / Modak (Kara & Sweet)", aliases: ["kolukattai", "kozhukattai", "pidi kolukattai", "pooranam kolukattai", "paal kolukattai"], kcal: 185, protein: 3.5, carbs: 35, fibre: 2.0 },
    { name: "Murukku (Kai / Mullu / Thenkuzhal / Arisi Murukku)", aliases: ["murukku", "kai murukku", "thengai", "mullu murukku", "manapparai murukku", "butter murukku", "chakli", "achumurukku"], kcal: 515, protein: 8.5, carbs: 56, fibre: 3.5 },
    { name: "Thattai / Seedai / Ribbon Pakoda / Oma Podi", aliases: ["thattai", "thattuvadai", "thattu vadai set", "norukkal", "seedai", "ribbon pakoda", "ola pakoda", "oma podi", "sev", "karasev", "sattur sevu"], kcal: 520, protein: 10.5, carbs: 52, fibre: 4.2 },
    { name: "Mixture (Madras Mixture / Kara Mixture / Corn Mixture)", aliases: ["mixture", "madras mixture", "kara mixture", "bombay mixture", "haldirams", "bhujia", "kara boondi", "boondi"], kcal: 535, protein: 12.0, carbs: 48, fibre: 5.0 },
    { name: "Banana Chips (Nendran / Vazhaikkai Chips)", aliases: ["banana chips", "nendran chips", "ethakka chips", "vazhaikkai chips"], kcal: 519, protein: 2.3, carbs: 58, fibre: 7.7 },
    { name: "Potato Chips (Lays / Salted / Masala Chips)", aliases: ["potato chips", "chips", "lays", "lay's", "bingo", "uncle chipps", "urulaikizhangu chips"], kcal: 536, protein: 7.0, carbs: 53, fibre: 4.8 },
    { name: "Tapioca Chips (Maravalli Kizhangu / Kuchi Chips)", aliases: ["tapioca chips", "maravalli kizhangu chips", "kuchi chips", "kappa chips", "wheel chips", "fryums", "appalam", "papad"], kcal: 495, protein: 2.5, carbs: 64, fibre: 3.8 },
    { name: "Kurkure / Bingo Mad Angles / Cheetos / Puffcorn", aliases: ["kurkure", "mad angles", "cheetos", "puffcorn", "corn puffs", "nachos"], kcal: 545, protein: 6.2, carbs: 56, fibre: 2.5 },
    { name: "Popcorn (Salted / Butter / Act II)", aliases: ["popcorn", "act ii", "butter popcorn"], kcal: 425, protein: 9.0, carbs: 58, fibre: 10.0 },
    { name: "Marie Biscuit (Marie Gold / Vita Marie)", aliases: ["marie biscuit", "marie gold", "biscuit", "milk bikis", "parle g", "50 50", "krackjack", "monaco"], kcal: 445, protein: 7.5, carbs: 74, fibre: 2.0 },
    { name: "Cream / Butter Biscuits (Good Day / Oreo / Bourbon / Dark Fantasy)", aliases: ["good day", "oreo", "bourbon", "hide and seek", "jim jam", "dark fantasy", "cookies", "butter biscuit", "osmania biscuit"], kcal: 495, protein: 6.0, carbs: 68, fibre: 2.2 },
    { name: "Rusk / Ooty Varkey / Khari", aliases: ["rusk", "tea rusk", "milk rusk", "varkey", "ooty varkey", "khari"], kcal: 430, protein: 8.5, carbs: 72, fibre: 2.5 },
    { name: "Kadalai Mittai (Kovilpatti Peanut Chikki)", aliases: ["kadalai mittai", "chikki", "peanut chikki", "kadalai urundai", "kovilpatti kadalai mittai"], kcal: 490, protein: 14.5, carbs: 56, fibre: 5.2 },
    { name: "Ellu Urundai / Sesame Ball (Til Laddu)", aliases: ["ellu urundai", "ellu mittai", "sesame ball", "til laddu"], kcal: 480, protein: 12.0, carbs: 52, fibre: 6.8 },
    { name: "Pori Urundai / Murmura / Kara Pori (Puffed Rice)", aliases: ["pori", "kara pori", "masala pori", "pori urundai", "nel pori", "aval pori"], kcal: 380, protein: 6.5, carbs: 78, fibre: 2.5 },
    { name: "Simili Urundai (Ragi Peanut Ball)", aliases: ["simili urundai", "ragi laddu", "kezhvaragu urundai", "pasiparuppu urundai"], kcal: 410, protein: 10.5, carbs: 62, fibre: 5.5 },
    { name: "Dairy Milk / KitKat / 5 Star / Snickers / Chocolate", aliases: ["chocolate", "dairy milk", "kitkat", "5 star", "snickers", "munch", "perk", "dark chocolate"], kcal: 525, protein: 6.5, carbs: 60, fibre: 3.0 },
    { name: "Cake (Black Forest / Plum Cake / Tea Cake / Brownie)", aliases: ["cake", "plum cake", "tea cake", "sponge cake", "black forest", "white forest", "pastry", "brownie", "cupcake"], kcal: 385, protein: 5.0, carbs: 54, fibre: 1.5 },
    { name: "Ice Cream / Kulfi / Cone Ice", aliases: ["ice cream", "kulfi", "cone ice", "chocobar", "cassata", "falooda"], kcal: 207, protein: 3.5, carbs: 24, fibre: 0.5 },
    { name: "Mysore Pak / Mysurpa", aliases: ["mysore pak", "mysurpa", "ghee mysore pak", "palgova", "milk peda", "kaju katli"], kcal: 485, protein: 6.5, carbs: 55, fibre: 1.5 },
    { name: "Tirunelveli Halwa / Wheat Halwa / Badam Halwa", aliases: ["halwa", "tirunelveli halwa", "iruttukadai halwa", "wheat halwa", "carrot halwa", "badam halwa", "muscoth halwa"], kcal: 420, protein: 4.0, carbs: 62, fibre: 1.2 },
    { name: "Laddu / Boondi Laddu / Jangiri / Jalebi", aliases: ["laddu", "ladoo", "boondi laddu", "motichoor laddu", "jangiri", "jalebi", "badusha"], kcal: 415, protein: 5.5, carbs: 64, fibre: 1.8 },
    { name: "Gulab Jamun / Rasgulla / Rasmalai", aliases: ["gulab jamun", "jamun", "rasgulla", "rasmalai", "makkan peda"], kcal: 325, protein: 5.0, carbs: 52, fibre: 0.8 },
    { name: "Rava Kesari / Pineapple Kesari", aliases: ["kesari", "rava kesari", "pineapple kesari", "aval kesari"], kcal: 285, protein: 3.5, carbs: 45, fibre: 1.0 },
    { name: "Payasam (Semiya / Pal / Paruppu / Ada Pradhaman)", aliases: ["payasam", "paal payasam", "semiya payasam", "paruppu payasam", "javvarisi payasam", "kheer"], kcal: 165, protein: 4.2, carbs: 26, fibre: 0.8 },
    { name: "Adhirasam / Kaijoora / Paniyaram Sweet", aliases: ["adhirasam", "athirasam", "kajjaya", "unniyappam", "nei appam"], kcal: 390, protein: 4.5, carbs: 64, fibre: 1.5 },
    { name: "Whey Protein Powder", aliases: ["whey protein", "whey", "protein powder", "protein scoop", "isolate whey"], kcal: 390, protein: 78, carbs: 8.0, fibre: 1.0 },
    { name: "Milk (Cow Milk / Paal)", aliases: ["milk", "paal", "cow milk", "toned milk", "aavin milk"], kcal: 62, protein: 3.2, carbs: 4.8, fibre: 0 },
    { name: "Curd / Thayir", aliases: ["curd", "thayir", "yogurt", "dahi", "greek yogurt"], kcal: 60, protein: 3.1, carbs: 4.0, fibre: 0 },
    { name: "Buttermilk (Mor)", aliases: ["buttermilk", "mor", "neer mor", "chaas", "masala mor"], kcal: 20, protein: 1.0, carbs: 1.5, fibre: 0 },
    { name: "Ghee (Nei) / Butter", aliases: ["ghee", "nei", "butter", "vennai"], kcal: 900, protein: 0, carbs: 0, fibre: 0 },
    { name: "Cheese Slice / Mozzarella / Cube", aliases: ["cheese", "cheese slice", "cheese cube", "mozzarella"], kcal: 320, protein: 20.0, carbs: 2.5, fibre: 0 },
    { name: "Coconut Chutney", aliases: ["coconut chutney", "thengai chutney", "chutney"], kcal: 240, protein: 3.5, carbs: 10, fibre: 4.0 },
    { name: "Peanut Chutney (Verkadalai Chutney)", aliases: ["peanut chutney", "verkadalai chutney", "kadalai chutney"], kcal: 280, protein: 9.5, carbs: 12, fibre: 3.5 },
    { name: "Tomato / Kara / Mint Chutney", aliases: ["tomato chutney", "kara chutney", "onion chutney", "thakkali chutney", "pudina chutney"], kcal: 80, protein: 1.5, carbs: 10, fibre: 1.8 },
    { name: "Idli Podi (Milagai Podi with Oil)", aliases: ["idli podi", "milagai podi", "paruppu podi", "karuveppilai podi"], kcal: 410, protein: 14.0, carbs: 42, fibre: 8.0 },
    { name: "Banana (Vazhaipazham)", aliases: ["banana", "vazhaipazham", "poovan", "yelakki", "karpooravalli", "moris", "rasthali"], kcal: 89, protein: 1.1, carbs: 22.8, fibre: 2.6 },
    { name: "Red Banana (Sevazhai)", aliases: ["red banana", "sevazhai", "sevvazhai"], kcal: 95, protein: 1.3, carbs: 25, fibre: 3.0 },
    { name: "Nendran Banana", aliases: ["nendran", "nendran banana", "ethapazham"], kcal: 120, protein: 1.4, carbs: 31, fibre: 2.3 },
    { name: "Apple / Pomegranate / Orange / Mango", aliases: ["apple", "pomegranate", "madulai", "orange", "mango", "maampazham", "grapes", "watermelon", "tharpoosani", "muskmelon", "kirni", "pineapple", "jackfruit", "palapazham"], kcal: 60, protein: 0.7, carbs: 14, fibre: 2.2 },
    { name: "Guava (Koyya)", aliases: ["guava", "koyya", "koyyapazham"], kcal: 68, protein: 2.6, carbs: 14, fibre: 5.4 },
    { name: "Papaya (Pappali)", aliases: ["papaya", "pappali"], kcal: 43, protein: 0.5, carbs: 11, fibre: 1.7 },
    { name: "Cucumber / Carrot / Salad", aliases: ["cucumber", "vellarikkai", "carrot", "beetroot", "salad", "vegetable salad"], kcal: 30, protein: 0.9, carbs: 6.5, fibre: 2.0 },
    { name: "Filter Coffee / Tea", aliases: ["coffee", "filter coffee", "tea", "chai", "milk tea", "ginger tea", "masala tea"], kcal: 45, protein: 1.5, carbs: 6.5, fibre: 0 },
    { name: "Black Coffee / Green Tea / Lemon Tea", aliases: ["black coffee", "green tea", "lemon tea", "black tea", "sukku coffee", "karupatti coffee"], kcal: 10, protein: 0.2, carbs: 2.0, fibre: 0 },
    { name: "Boost / Horlicks / Bournvita with Milk", aliases: ["boost", "horlicks", "bournvita", "complan", "malt"], kcal: 95, protein: 3.8, carbs: 14, fibre: 0.5 },
    { name: "Madurai Jigarthanda", aliases: ["jigarthanda", "madurai jigarthanda"], kcal: 155, protein: 3.5, carbs: 26, fibre: 1.0 },
    { name: "Rose Milk / Badam Milk", aliases: ["rose milk", "rosemilk", "badam milk", "badam paal", "pista milk", "milkshake", "chocolate milkshake"], kcal: 115, protein: 3.4, carbs: 18, fibre: 0.3 },
    { name: "Tender Coconut Water (Elaneer)", aliases: ["elaneer", "ilaneer", "tender coconut", "coconut water"], kcal: 19, protein: 0.7, carbs: 3.7, fibre: 1.1 },
    { name: "Nannari Sarbath / Lemon Juice / Fresh Juice", aliases: ["sarbath", "nannari sarbath", "lemon juice", "lime juice", "kulukki sarbath", "sugarcane juice", "karumbu juice", "watermelon juice", "orange juice", "sathukudi juice", "mosambi juice"], kcal: 52, protein: 0.4, carbs: 13, fibre: 0.4 },
    { name: "Soft Drinks (Bovonto / Coke / Pepsi / Sprite / Goli Soda)", aliases: ["bovonto", "coke", "coca cola", "pepsi", "sprite", "7up", "fanta", "mirinda", "maaza", "slice", "frooti", "goli soda", "paneer soda", "soft drink", "cool drinks"], kcal: 44, protein: 0, carbs: 11, fibre: 0 }
];

const ensureFoodsSeeded = async () => {
    const count = await Food.countDocuments();
    if (count < tamilNaduFoods.length) {
        await Food.deleteMany({});
        await Food.insertMany(tamilNaduFoods);
    }
};

exports.getFitnessData = async (req, res) => {
    try {
        await ensureFoodsSeeded();
        const userId = req.user.id || req.user._id; 
        
        let fitnessData = await Fitness.findOne({ userId });

        if (!fitnessData) {
            fitnessData = new Fitness({
                userId,
                profile: { weight: 0, height: 0 },
                workoutPlan: [],
                nutrition: {
                    waterGoal: 0,
                    waterIntake: 0,
                    target: { kcal: 0, protein: 0, carbs: 0, fibre: 0 },
                    consumed: { kcal: 0, protein: 0, carbs: 0, fibre: 0 },
                    foodDiary: []
                }
            });
            await fitnessData.save();
        }

        res.status(200).json({ success: true, fitness: fitnessData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { weight, height, waterGoal, workoutPlan, target } = req.body;

        const updateFields = {
            'profile.weight': weight,
            'profile.height': height
        };

        if (typeof waterGoal === 'number') {
            updateFields['nutrition.waterGoal'] = waterGoal;
        }

        if (Array.isArray(workoutPlan)) {
            updateFields.workoutPlan = workoutPlan;
        }

        if (target) {
            updateFields['nutrition.target'] = target;
        }

        const fitnessData = await Fitness.findOneAndUpdate(
            { userId },
            { $set: updateFields },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, message: 'Profile updated', fitness: fitnessData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.searchFood = async (req, res) => {
    try {
        await ensureFoodsSeeded();
        const query = (req.query.q || '').trim().toLowerCase();
        if (!query) {
            return res.status(400).json({ success: false, message: 'Query is required' });
        }

        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedQuery, 'i');

        let exactFood = await Food.findOne({
            $or: [
                { aliases: { $elemMatch: { $regex: `^${escapedQuery}$`, $options: 'i' } } },
                { name: { $regex: `^${escapedQuery}$`, $options: 'i' } }
            ]
        });

        const matchingFoods = await Food.find({
            $or: [
                { name: regex },
                { aliases: regex }
            ]
        }).limit(8);

        let foodsList = [...matchingFoods];
        if (exactFood) {
            foodsList = [exactFood, ...matchingFoods.filter(f => f._id.toString() !== exactFood._id.toString())].slice(0, 8);
        }

        if (foodsList.length > 0) {
            return res.status(200).json({
                success: true,
                found: true,
                food: foodsList[0],
                foods: foodsList
            });
        }

        return res.status(200).json({ success: true, found: false, foods: [] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.updateWaterIntake = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { waterIntake } = req.body;

        const fitnessData = await Fitness.findOneAndUpdate(
            { userId },
            { $set: { 'nutrition.waterIntake': waterIntake } },
            { new: true }
        );

        res.status(200).json({ success: true, message: 'Water intake updated', fitness: fitnessData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.addFoodItem = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { name, weight, kcal, protein, carbs, fibre } = req.body;

        const fitnessData = await Fitness.findOne({ userId });
        if (!fitnessData) return res.status(404).json({ success: false, message: 'Fitness data not found' });

        const newFood = { name, weight, kcal, protein, carbs, fibre };
        fitnessData.nutrition.foodDiary.push(newFood);

        fitnessData.nutrition.consumed.kcal += Number(kcal);
        fitnessData.nutrition.consumed.protein += Number(protein);
        fitnessData.nutrition.consumed.carbs += Number(carbs);
        fitnessData.nutrition.consumed.fibre += Number(fibre);

        await fitnessData.save();

        res.status(200).json({ success: true, message: 'Food added', fitness: fitnessData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.deleteFoodItem = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const foodId = req.params.foodId;

        const fitnessData = await Fitness.findOne({ userId });
        if (!fitnessData) return res.status(404).json({ success: false, message: 'Fitness data not found' });

        const foodIndex = fitnessData.nutrition.foodDiary.findIndex(food => food._id.toString() === foodId);
        
        if (foodIndex === -1) {
            return res.status(404).json({ success: false, message: 'Food item not found' });
        }

        const foodToDelete = fitnessData.nutrition.foodDiary[foodIndex];

        fitnessData.nutrition.consumed.kcal = Math.max(0, fitnessData.nutrition.consumed.kcal - foodToDelete.kcal);
        fitnessData.nutrition.consumed.protein = Math.max(0, fitnessData.nutrition.consumed.protein - foodToDelete.protein);
        fitnessData.nutrition.consumed.carbs = Math.max(0, fitnessData.nutrition.consumed.carbs - foodToDelete.carbs);
        fitnessData.nutrition.consumed.fibre = Math.max(0, fitnessData.nutrition.consumed.fibre - foodToDelete.fibre);

        fitnessData.nutrition.foodDiary.splice(foodIndex, 1);

        await fitnessData.save();

        res.status(200).json({ success: true, message: 'Food deleted', fitness: fitnessData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};