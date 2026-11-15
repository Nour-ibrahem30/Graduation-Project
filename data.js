/**
 * متجر غُـرْزَة | Ghorza Craft Studio
 * قاعدة البيانات الشاملة لمنتجات الهاند ميد المصرية
 */

const STORE_INFO = {
  name: 'غُـرْزَة | Ghorza Craft Studio',
  shortName: 'غُـرْزَة',
  tagline: 'ملتقى الحرف اليدوية المصرية الأصيلة • صُنعت لتُورّث',
  badge: 'مشغولات يدوية 100% • ورش القاهرة',
  contact: {
    email: 'contact@ghorza-crafts.eg',
    phone: '01098765432',
    whatsapp: '201098765432',
    instagram: '@ghorza.crafts',
    address: 'المعادي، القاهرة، مصر'
  },
  about: {
    short: 'استوديو للمشغولات اليدوية المصرية الأصيلة، يجمع بين دقة التطريز، دفء الكروشيه، بريق الريزن، وبهجة الخرز.',
    full: 'بدأت «غُـرْزَة» كحركة تمرد ضد الاستهلاك السريع والمنتجات البلاستيكية المستوردة. نؤمن بأن كل غرزة خيط، وكل لمسة ريزن، وكل عقدة مكرمية، وكل حبة خرز، تحمل في طياتها حكاية صانع مصري أودع فيها وقته وشغفه لتصل إليك قطعة فنية تدوم عمراً كاملاً.',
    makerStory: 'في ورش المعادي والقاهرة، يتعاون نخبة من الحرفيين المتفرغين لخلق قطع تجمع بين روح الأصالة المصرية والجماليات المعاصرة، خالية من المواد الضارة والمصنعة بتأني وصبر.'
  },
  features: [
    { icon: 'verified', title: 'صناعة يدوية 100%', desc: 'كل قطعة مشغولة يدوياً بعناية فائقة' },
    { icon: 'local_shipping', title: 'شحن مجاني فوق 1,500 ج.م', desc: 'توصيل سريع لكافة محافظات مصر' },
    { icon: 'edit_note', title: 'تخصيص مجاني بالاسم', desc: 'تطريز أو حفر الأسماء والعبارات حسب رغبتك' },
    { icon: 'all_inclusive', title: 'ضمان الجودة والمتانة', desc: 'خامات طبيعية تدوم لسنوات وتكتسب عتقاً' }
  ]
};

// أنواع الهاند ميد الرئيسية
const CRAFT_TYPES = [
  { id: 'all', name: 'الكل', icon: 'auto_awesome', count: 24, description: 'استعراض كل المجموعات الحرفية' },
  { id: 'embroidery', name: 'تطريز يدوي', icon: 'filter_vintage', count: 8, description: 'طارات ورود مجسمة ولوحات خيطية' },
  { id: 'crochet', name: 'كروشيه وتريكو', icon: 'styler', count: 6, description: 'كارديجان صوف، شنط لؤلؤ، وقفازات' },
  { id: 'gift_hoops', name: 'طارات ومكرميات', icon: 'card_giftcard', count: 5, description: 'طارات مباركة، هدايا صداقة ومواليد، مكرميات' },
  { id: 'beaded', name: 'إكسسوارات خرز', icon: 'diamond', count: 5, description: 'أساور ديزي ملونة، سلاسل وأطقم صيفية' },
  { id: 'resin', name: 'فن الريزن والديكور', icon: 'palette', count: 6, description: 'كوسترات رخامية، فواصل كتب، وصواني' },
];

// الفئات العمرية
const AGE_GROUPS = [
  { id: 'all', name: 'جميع الأعمار', icon: 'groups' },
  { id: 'kids', name: 'أطفال ومواليد', icon: 'child_care', desc: 'هدايا سبوع، كروشيه ناعم، أساور أطفال لطيفة' },
  { id: 'teens', name: 'صبايا وشباب', icon: 'school', desc: 'أساور خرز تريندي، كارديجان ورد، شنط، فواصل قراءة' },
  { id: 'adults', name: 'كبار وبالغين / الجميع', icon: 'person', desc: 'ديكور منزلي، مكرميات، كوسترات ريزن، وإكسسوارات يدوية' }
];

// المنتجات اليدوية الشاملة
const PRODUCTS = [
  // ================= 1. التطريز اليدوي =================
  {
    id: 'emb-001',
    name: 'طارة التطريز التراثية: ماكينة الخياطة والزهور',
    craftType: 'embroidery',
    craftTypeName: 'تطريز يدوي',
    ageGroup: 'adults',
    ageGroupName: 'كبار وبالغين / الجميع',
    price: 650,
    comparePrice: 750,
    images: [
      'assets/embroidery/embroidery-2.jpg',
      'assets/embroidery/embroidery-1.jpg'
    ],
    badge: 'الأكثر إعجاباً',
    inStock: true,
    stockCount: 5,
    rating: 5.0,
    reviewsCount: 38,
    description: 'طارة تطريز خشبية مجسمة مستوحاة من آلات الخياطة الكلاسيكية محاطة بزهور بارزة مشغولة بغرز البرازيل وغرزة الستان الفاخرة.',
    details: {
      materials: 'خيوط قطن مصري 100%، طارة خشب زان قطر 22 سم، قماش كتان خام',
      dimensions: 'القطر: 22 سم، العمق: 1.5 سم',
      careInstructions: 'تنظف بفرشاة ناعمة جافة، تحفظ بعيداً عن الرطوبة المباشرة'
    },
    customizable: true,
    customFieldLabel: 'إضافة اسم أو إهداء خلف الطارة مجاناً'
  },
  {
    id: 'emb-002',
    name: 'طارة سيدة الخريف: أوراق الشجر المجسمة ثلاثية الأبعاد',
    craftType: 'embroidery',
    craftTypeName: 'تطريز يدوي',
    ageGroup: 'teens',
    ageGroupName: 'صبايا وشباب',
    price: 720,
    comparePrice: null,
    images: [
      'assets/embroidery/embroidery-5.jpg',
      'assets/embroidery/embroidery-3.jpg'
    ],
    badge: 'قطعة فنية مميزة',
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 29,
    description: 'لوحة تطريز ساحرة تجسد ألوان الخريف الذهبية والبرتقالية، تتدلى فيها أوراق الشجر بخيوط حريرية بارزة تشعرك بحركة الرياح.',
    details: {
      materials: 'خيوط دي إم سي ومولينيه، طارة بامبو طبيعي، قماش قطن ناعم',
      dimensions: 'القطر: 20 سم',
      careInstructions: 'تعليق جداري بواسطة شريط حريري أو حلقة نحاسية مدمجة'
    },
    customizable: false
  },
  {
    id: 'emb-003',
    name: 'طارة زهور الأقحوان والنحلة الذهبية',
    craftType: 'embroidery',
    craftTypeName: 'تطريز يدوي',
    ageGroup: 'kids',
    ageGroupName: 'أطفال ومواليد',
    price: 480,
    comparePrice: 550,
    images: [
      'assets/gift_hoops/gift-13.jpg',
      'assets/embroidery/embroidery-6.jpg'
    ],
    badge: 'مناسبة لغرف الأطفال',
    inStock: true,
    stockCount: 8,
    rating: 4.8,
    reviewsCount: 21,
    description: 'تطريز دقيق ومبهج لزهور الربيع البيضاء ببتلات بارزة ملموسة مع نحلة عسل لطيفة، مثالية لتزيين غرف الصغار والمواليد الجدد.',
    details: {
      materials: 'خيوط قطن طبيعية خالية من أي صبغات كيميائية، طارة خشبية آمنة',
      dimensions: 'القطر: 18 سم',
      careInstructions: 'تنظيف جاف خفيف'
    },
    customizable: true,
    customFieldLabel: 'تطريز اسم الطفل وتاريخ الميلاد'
  },

  // ================= 2. الكروشيه والتريكو =================
  {
    id: 'cro-001',
    name: 'كارديجان الصوف الفاخر بحبات الكرز النافرة',
    craftType: 'crochet',
    craftTypeName: 'كروشيه وتريكو',
    ageGroup: 'teens',
    ageGroupName: 'صبايا وشباب',
    price: 1850,
    comparePrice: 2200,
    images: [
      'assets/crochet/crochet-8.jpg',
      'assets/crochet/crochet-1.jpg'
    ],
    badge: 'التريند الأكثر مبيعاً',
    inStock: true,
    stockCount: 4,
    rating: 5.0,
    reviewsCount: 64,
    description: 'كارديجان محبوك يدوياً من أفخر خيوط الصوف الأبيض العاجي، مزين بحبات كرز كروشيه حمراء ثلاثية الأبعاد وأزرار عاجية ناعمة. دافئ وخفيف الوزن ومثالي للإطلالات الجامعية والشتوية الأنيقة.',
    details: {
      materials: 'خيوط صوف تركي ناعم بنسبة 70% وقطن 30% مقاوم للتحبب',
      dimensions: 'مقاس موحد مريح (Oversized Free Size) يناسب من S إلى L',
      careInstructions: 'غسيل يدوي بماء بارد وشامبو صوف، التجفيف بشكل مسطح'
    },
    customizable: true,
    customFieldLabel: 'طلب مقاس مخصص أو لون صوف مختلف'
  },
  {
    id: 'cro-002',
    name: 'حقيبة يد كروشيه بنقشة زهور الباستيل ومقبض لؤلؤ',
    craftType: 'crochet',
    craftTypeName: 'كروشيه وتريكو',
    ageGroup: 'teens',
    ageGroupName: 'صبايا وشباب',
    price: 790,
    comparePrice: 920,
    images: [
      'assets/crochet/crochet-14.jpg',
      'assets/crochet/crochet-3.jpg'
    ],
    badge: 'قطعة مناسبات وسهرات',
    inStock: true,
    stockCount: 6,
    rating: 4.9,
    reviewsCount: 42,
    description: 'شنطة يد كروشيه أنيقة بزهور ثلاثية الأبعاد بدرجات الوردي والأبيض، مرصعة في مركز كل زهرة بحبة لؤلؤ عاجي، مع مقبض سلسلة لؤلؤ فاخر وبطانة داخلية من الستان الناعم.',
    details: {
      materials: 'خيوط مكرامية قطنية ناعمة، لؤلؤ عاجي صناعي عالي الجودة، قفل مغناطيسي خفي',
      dimensions: 'الطول: 22 سم، الارتفاع: 16 سم، العرض: 6 سم',
      careInstructions: 'تنظيف سطحي بقطعة قماش مبللة'
    },
    customizable: true,
    customFieldLabel: 'إمكانية تغيير لون الورد أو طول السلسلة'
  },
  {
    id: 'cro-003',
    name: 'قفازات صوف بدون أصابع بنقشة فيونكة كروشيه',
    craftType: 'crochet',
    craftTypeName: 'كروشيه وتريكو',
    ageGroup: 'teens',
    ageGroupName: 'صبايا وشباب',
    price: 340,
    comparePrice: 400,
    images: [
      'assets/crochet/crochet-2.jpg',
      'assets/crochet/crochet-4.jpg'
    ],
    badge: 'عملي ولطيف للشتاء',
    inStock: true,
    stockCount: 12,
    rating: 4.8,
    reviewsCount: 33,
    description: 'قفازات ناعمة مريحة تحافظ على دفء يديك أثناء استخدام الهاتف أو الدراسة، محبوكة بغرزة بارزة مع فيونكة كروشيه بيضاء ساحرة.',
    details: {
      materials: 'خيوط صوف أكرليك فائق النعومة ومضاد للحساسية',
      dimensions: 'مقاس مطاطي مريح يناسب جميع أحجام الأيدي',
      careInstructions: 'غسيل يدوي أو بالغسالة على دورة الملابس الحساسة'
    },
    customizable: true,
    customFieldLabel: 'متوفر بألوان: وردي، أبيض عاجي، بيج، أزرق هادئ'
  },

  // ================= 3. طارات الهدايا والمكرميات =================
  {
    id: 'gift-001',
    name: 'طارة مباركة المنزل: "اللهم بارك هذا البيت وأهله"',
    craftType: 'gift_hoops',
    craftTypeName: 'طارات ومكرميات',
    ageGroup: 'adults',
    ageGroupName: 'كبار وبالغين / الجميع',
    price: 850,
    comparePrice: 980,
    images: [
      'assets/gift_hoops/gift-2.jpg',
      'assets/gift_hoops/gift-1.jpg'
    ],
    badge: 'الهدية المثالية للبيت الجديد',
    inStock: true,
    stockCount: 7,
    rating: 5.0,
    reviewsCount: 57,
    description: 'طارة تطريز إسلامية عريقة مطرزة بخط عربي رائع باللون الأخضر الملكي مع قفص عصافير وزهور بارزة وردية وشريط أنيق للتعليق. هدية تترك بصمة لا تنسى لكل منزل جديد.',
    details: {
      materials: 'خيوط قطن مصري متينة وثابتة اللون، طارة خشبية بيضاوية، شريط ستان فاخر',
      dimensions: 'القطر: 26 سم',
      careInstructions: 'تعليق داخلي بعيداً عن الماء المباشر'
    },
    customizable: true,
    customFieldLabel: 'إضافة اسم العائلة أو تاريخ الانتقال للمنزل'
  },
  {
    id: 'gift-002',
    name: 'طارة الصداقة والمحبة: إطار زهور عباد الشمس',
    craftType: 'gift_hoops',
    craftTypeName: 'طارات ومكرميات',
    ageGroup: 'teens',
    ageGroupName: 'صبايا وشباب',
    price: 590,
    comparePrice: null,
    images: [
      'assets/gift_hoops/gift-7.jpg',
      'assets/gift_hoops/gift-8.jpg'
    ],
    badge: 'هدية الصديقة المفضلة',
    inStock: true,
    stockCount: 9,
    rating: 4.9,
    reviewsCount: 46,
    description: 'تجسيد دافئ لرابطة الصداقة والأخوة برسم خطي مطرز يدوياً محاط بإكليل من زهور عباد الشمس الصفراء المبهجة، مع إمكانية كتابة اسم الصديقتين.',
    details: {
      materials: 'خيوط قطنية نقية، قماش كانفاس أبيض، طارة خشبية بمسمار نحاسي',
      dimensions: 'القطر: 20 سم',
      careInstructions: 'تنظيف جاف فقط'
    },
    customizable: true,
    customFieldLabel: 'اكتب اسم الصديقتين أو عبارة إهداء خاصة'
  },
  {
    id: 'gift-003',
    name: 'معلقة المكرمية الجدارية البوهيمية: شلال الريش القطني',
    craftType: 'gift_hoops',
    craftTypeName: 'طارات ومكرميات',
    ageGroup: 'adults',
    ageGroupName: 'كبار وبالغين / الجميع',
    price: 950,
    comparePrice: 1100,
    images: [
      'assets/gift_hoops/gift-1.jpg',
      'assets/gift_hoops/gift-3.jpg'
    ],
    badge: 'ديكور بوهيمي راقي',
    inStock: true,
    stockCount: 4,
    rating: 4.9,
    reviewsCount: 31,
    description: 'معلقة جدارية منسوجة يدوياً من خيوط غزل القطن الطبيعي بنمط السنبلة والريش البوهيمي المتدرج على ساق خشب طبيعي مصقول، تعطي دفئاً وفخامة لأي جدار.',
    details: {
      materials: 'حبال قطن مصري مبرومة غير معالجة كيميائياً، عود خشب زان طبيعي',
      dimensions: 'العرض: 45 سم، الارتفاع الإجمالي: 70 سم',
      careInstructions: 'تسريح الأطراف بلطف بمشط واسع للحفاظ على نعومة الخيوط'
    },
    customizable: false
  },

  // ================= 4. إكسسوارات الخرز =================
  {
    id: 'bead-001',
    name: 'مجموعة أساور ورود الديزي الصيفية (Daisy Bead Bracelets)',
    craftType: 'beaded',
    craftTypeName: 'إكسسوارات خرز',
    ageGroup: 'teens',
    ageGroupName: 'صبايا وشباب',
    price: 180,
    comparePrice: 240,
    images: [
      'assets/beaded/beaded-2.jpg',
      'assets/beaded/beaded-1.jpg'
    ],
    badge: 'أكثر من 8 ألوان مبهجة',
    inStock: true,
    stockCount: 20,
    rating: 4.9,
    reviewsCount: 78,
    description: 'أساور خرز ياباني دقيقة منسوجة على شكل باقة ورود ديزي صغيرة ومتراصة بألوان زاهية ورباط إغلاق ستانلس قابل للتعديل لا يغير لونه بالماء.',
    details: {
      materials: 'خرز زجاجي ياباني أصلي، خيط نايلون حراري متين، قفل وسلسلة تمديد ستانلس 316L',
      dimensions: 'الطول: 15 سم + 5 سم سلسلة تمديد لتناسب كل المعاصم',
      careInstructions: 'مقاوم للماء والعرق، يفضل تجفيفه بعد الاستحمام'
    },
    customizable: true,
    customFieldLabel: 'اختر مزيج الألوان المفضل لك (أصفر، وردي، أزرق، أحمر)'
  },
  {
    id: 'bead-002',
    name: 'طقم سلاسل الأحجار الكريمة والخرز الكريستالي المتدرج',
    craftType: 'beaded',
    craftTypeName: 'إكسسوارات خرز',
    ageGroup: 'teens',
    ageGroupName: 'صبايا وشباب',
    price: 320,
    comparePrice: 380,
    images: [
      'assets/beaded/beaded-1.jpg',
      'assets/beaded/beaded-3.jpg'
    ],
    badge: 'إطلالة صيفية عصرية',
    inStock: true,
    stockCount: 14,
    rating: 4.8,
    reviewsCount: 45,
    description: 'عقود خرز وأحجار طبيعية ملونة متناسقة مع حليات نحاسية مطلية ذهب، تمنح رقبتك لمسة حيوية صيفية خفيفة وعصرية.',
    details: {
      materials: 'خرز كريستال كوارتز صناعي، خرز تايجر آي (عين النمر)، قفل ستانلس ذهبي',
      dimensions: 'طول العقد: 40 سم + 5 سم تمديد',
      careInstructions: 'تجنب ملامسة العطور المباشرة'
    },
    customizable: false
  },
  {
    id: 'bead-003',
    name: 'إسوارة الأطفال المبهجة بألوان الحلوى والميدالية اللطيفة',
    craftType: 'beaded',
    craftTypeName: 'إكسسوارات خرز',
    ageGroup: 'kids',
    ageGroupName: 'أطفال ومواليد',
    price: 120,
    comparePrice: null,
    images: [
      'assets/beaded/beaded-4.jpg',
      'assets/beaded/beaded-2.jpg'
    ],
    badge: 'آمنة ومريحة للأطفال',
    inStock: true,
    stockCount: 25,
    rating: 4.9,
    reviewsCount: 39,
    description: 'أساور خرز مطاطية لطيفة خفيفة الوزن بألوان باستيل هادئة ومبهجة تناسب معاصم الأميرات الصغار في الحفلات والأعياد.',
    details: {
      materials: 'خرز سيليكون وأكريليك ناعم بدون حواف حادة، أستيك مرن عالي التحمل',
      dimensions: 'القطر: 12-14 سم مرن',
      careInstructions: 'قابلة للغسل بالماء والصابون'
    },
    customizable: true,
    customFieldLabel: 'كتابة اسم الطفلة بحروف الخرز الإنجليزية'
  },

  // ================= 5. فن الريزن والديكور =================
  {
    id: 'res-001',
    name: 'طقم كوسترات الريزن الرخامية مع حواف ورق الذهب (4 قطع)',
    craftType: 'resin',
    craftTypeName: 'فن الريزن والديكور',
    ageGroup: 'adults',
    ageGroupName: 'كبار وبالغين / الجميع',
    price: 490,
    comparePrice: 580,
    images: [
      'assets/resin/resin-1.jpg',
      'assets/resin/resin-2.jpg'
    ],
    badge: 'ضيافة ملكية فاخرة',
    inStock: true,
    stockCount: 8,
    rating: 5.0,
    reviewsCount: 52,
    description: 'كوسترات أكواب مصنوعة يدوياً من راتنج الإيبوكسي فائق اللمعان بتأثير رخامي رمادي ناعم ولمسات من ورق الذهب الإيطالي على الحواف المتموجة مع فرع زيتون مرسوم بدقة.',
    details: {
      materials: 'إيبوكسي ريزن غير سام ومقاوم للحرارة حتى 90 درجة، ورق ذهب نقي',
      dimensions: 'القطر: 12 سم لكل كوستر (طقم 4 قطع)',
      careInstructions: 'تنظيف بقطعة قماش ناعمة وصابون، تجنب غسالة الصحون'
    },
    customizable: true,
    customFieldLabel: 'إمكانية طلب طقم من 6 قطع أو كتابة الحروف الأولية'
  },
  {
    id: 'res-002',
    name: 'فواصل كتب الريزن الشفافة بالزهور الطبيعية المجففة',
    craftType: 'resin',
    craftTypeName: 'فن الريزن والديكور',
    ageGroup: 'teens',
    ageGroupName: 'صبايا وشباب',
    price: 160,
    comparePrice: 200,
    images: [
      'assets/resin/resin-10.jpg',
      'assets/resin/resin-3.jpg'
    ],
    badge: 'عشق القراء والكتب',
    inStock: true,
    stockCount: 15,
    rating: 4.9,
    reviewsCount: 68,
    description: 'فاصل كتب فني شفاف كأنه لوحة سحرية، محفوظ بداخله زهور برية طبيعية مجففة بعناية مع لمسات ذهبية وشراشيب حريرية ملونة أنيقة.',
    details: {
      materials: 'ريزن كريستالي عالي الشفافية ضد الاصفرار، زهور حقيقية مضغوطة، شرابة حرير',
      dimensions: 'الطول: 14 سم، العرض: 2.5 سم، السماكة: 2 ملم',
      careInstructions: 'يحفظ داخل الكتب وبعيداً عن أشعة الشمس القاسية المستمرة'
    },
    customizable: true,
    customFieldLabel: 'اختر لون الزهور المفضل (بنفسجي، وردي، أزرق، أبيض)'
  },
  {
    id: 'res-003',
    name: 'طقم ديكور صواني ومباخر الكونكريت والريزن مع الكريستال الذهبي',
    craftType: 'resin',
    craftTypeName: 'فن الريزن والديكور',
    ageGroup: 'adults',
    ageGroupName: 'كبار وبالغين / الجميع',
    price: 1350,
    comparePrice: 1550,
    images: [
      'assets/resin/resin-17.jpg',
      'assets/resin/resin-4.jpg'
    ],
    badge: 'ديكور منزلي راقي (5 قطع)',
    inStock: true,
    stockCount: 3,
    rating: 5.0,
    reviewsCount: 27,
    description: 'طقم ديكور كامل مكون من صينية تقديم مقوسة، فازة زهور، بونبونيرة بغطاء ذهبي ومبخرة، مكسوة بحبيبات كريستال ذهبية براقة تعكس الضوء بفخامة لا تضاهى.',
    details: {
      materials: 'مزيج مادة الجاسمونايت والكونكريت المعالج مع ريزن مذهب',
      dimensions: 'الصينية: 30x20 سم، الفازة: 18 سم ارتفاع',
      careInstructions: 'تنظيف جاف بقطعة قماش ناعمة'
    },
    customizable: false
  },

];

// خيارات الشحن لمحافظات مصر
const SHIPPING_OPTIONS = [
  {
    id: 'cairo_giza',
    name: 'القاهرة والجيزة',
    price: 50,
    estimatedDays: 'خلال 24 إلى 48 ساعة',
    details: 'توصيل لباب المنزل مع إمكانية المعاينة قبل الاستلام'
  },
  {
    id: 'alexandria',
    name: 'الإسكندرية والبحيرة',
    price: 60,
    estimatedDays: 'خلال 2 إلى 3 أيام',
    details: 'شحن مباشر وسريع'
  },
  {
    id: 'delta_canal',
    name: 'محافظات الدلتا والقناة',
    price: 65,
    estimatedDays: 'خلال 2 إلى 3 أيام',
    details: 'المنصورة، طنطا، الزقازيق، الإسماعيلية، بورسعيد، السويس'
  },
  {
    id: 'upper_egypt',
    name: 'محافظات الصعيد والبحر الأحمر',
    price: 80,
    estimatedDays: 'خلال 3 إلى 4 أيام',
    details: 'بني سويف، المنيا، أسيوط، سوهاج، قنا، الأقصر، أسوان، الغردقة'
  }
];

// آراء وتقييمات العملاء
const REVIEWS = [
  {
    name: 'مريم الشريف',
    city: 'المعادي، القاهرة',
    product: 'كارديجان الصوف الفاخر',
    category: 'كروشيه وتريكو',
    rating: 5,
    date: 'منذ أسبوع',
    comment: 'الكرز البارز تحفة فنية والصوف ناعم جداً ومبيشوكش نهائي! التغليف كان لطيف أوي وريحته عطرية ووصل في يومين بس.'
  },
  {
    name: 'نورهان حسام الدين',
    city: 'الزمالك، القاهرة',
    product: 'طارة مباركة المنزل',
    category: 'طارات ومكرميات',
    rating: 5,
    date: 'منذ أسبوعين',
    comment: 'أهديتها لأختي في بيتها الجديد وكان الكل منبهر بدقة الخط العربي والورد المجسم. فخر حقيقي للصناعة اليدوية المصرية!'
  },
  {
    name: 'د. ياسمين عادل',
    city: 'الإسكندرية',
    product: 'طقم كوسترات الريزن الرخامي',
    category: 'فن الريزن والديكور',
    rating: 5,
    date: 'منذ 3 أسابيع',
    comment: 'الكوسترات مع حواف الذهب بتنور الصالون! اللمعان عالي والريزن تقيل ومقاوم للحرارة. تجربة شراء راقية جداً.'
  },
  {
    name: 'سلمى مجدي',
    city: 'الدقي، الجيزة',
    product: 'أساور ورود الديزي الخرز',
    category: 'إكسسوارات خرز',
    rating: 5,
    date: 'منذ يومين',
    comment: 'طلبت 4 أساور ليا ولصاحباتي، الألوان في الحقيقة أحلى بكتير من الصور والقفل ستانلس متين مبيصديش.'
  }
];

// تصدير البيانات للنافذة العامة
if (typeof window !== 'undefined') {
  window.STORE_INFO = STORE_INFO;
  window.CRAFT_TYPES = CRAFT_TYPES;
  window.AGE_GROUPS = AGE_GROUPS;
  window.PRODUCTS = PRODUCTS;
  window.SHIPPING_OPTIONS = SHIPPING_OPTIONS;
  window.REVIEWS = REVIEWS;
}
