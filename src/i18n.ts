export type Language = 'el' | 'en';

export const t = {
  el: {
    nav: {
      home: 'αρχική',
      about: 'σχετικά με μας',
      gallery: 'gallery',
      booking: 'ημερολόγιο',
      location: 'τοποθεσία',
      contact: 'επικοινωνία',
    },
    hero: {
      title: '"τόπος συνάντησης\nκάθε καλοκαίρι"',
    },
    philosophy: {
      title: 'η φιλοσοφία της οικογένειας\nκαι των ανθρώπων μας',
      subtitle: 'Περιηγηθείτε στο λογότυπο του Λίθου για να ανακαλύψετε τις εμπειρίες που σας περιμένουν στην Εύβοια.',
      exploreItems: [
        {
          id: 'sea' as const,
          title: 'θάλασσα',
          description: 'Απολαύστε την αύρα του Αιγαίου και τα καταγάλανα νερά του Ευβοϊκού. Ένα καταφύγιο γαλήνης όπου το απέραντο γαλάζιο συναντά τον ουρανό, προσφέροντας απόλυτη αναζωογόνηση.',
          activities: ['Παραλία Αγίας Άννας', 'Παραλία Σαρακήνικο', 'Βόλτες στον Ευβοϊκό', 'Ψάρεμα και θαλάσσια σπορ']
        },
        {
          id: 'mountain' as const,
          title: 'βουνό',
          description: 'Ανακαλύψτε την άγρια ομορφιά και τα κρυφά μονοπάτια της Εύβοιας. Η ενέργεια της φύσης και τα απόκρημνα τοπία σας προσκαλούν σε αξέχαστες στιγμές εξερεύνησης και ηρεμίας.',
          activities: ['Πεζοπορία στο Δάσος', 'Φαράγγι Νηλέα', 'Καταρράκτες Δρυμώνα', 'Ορεινή ποδηλασία']
        },
        {
          id: 'home' as const,
          title: 'χώρος / σπίτι',
          description: 'Ο σεβασμός στην παραδοσιακή αρχιτεκτονική και η αίσθηση του «ανήκειν». Ένας χώρος φτιαγμένος με μεράκι που σας αγκαλιάζει.',
          activities: ['Χαλάρωση στο τζάκι', 'Διάβασμα στη σοφίτα', 'Τοπικές γεύσεις', 'Ηρεμία και απομόνωση']
        },
        {
          id: 'sun' as const,
          title: 'ήλιος / οικογένεια',
          description: 'Στιγμές μοιρασιάς, γέλιου και χαράς κάτω από τον ελληνικό ήλιο. Εκεί όπου η οικογένεια σμίγει και δημιουργεί αξέχαστες αναμνήσεις.',
          activities: ['Πρωινό στον κήπο', 'Παιχνίδι στη φύση', 'Απογευματινός καφές', 'Επιτραπέζια στην αυλή']
        },
        {
          id: 'bbq' as const,
          title: 'μπάρμπεκιου / καλωσόρισμα',
          description: 'Η καρδιά της φιλοξενίας χτυπά εδώ. Γύρω από τη φωτιά, μοιραζόμαστε γεύσεις, ιστορίες και την αυθεντική ελληνική φιλοξενία.',
          activities: ['Βραδιές BBQ', 'Παραδοσιακό φαγητό', 'Κρασί με φίλους', 'Γλέντι και μουσική']
        }
      ]
    },
    guesthouse: 'ξενώνας στην Εύβοια',
    visualIdentity: 'Οπτική Ταυτότητα',
    lithos: 'Λίθος',
    historyTitle: 'Η ιστορία',
    history1: 'Το μοναδικό πέτρινο σπίτι του χωριού, σημείο συνάντησης της οικογένειας Καρλή. Ξέγνοιαστα καλοκαίρια, αξέχαστες στιγμές.',
    history2: 'Το σπίτι αυτό αγκάλιασε με την ζεστασιά και την θαλπωρή του, οικογένεια, φίλους και όλους όσους πέρασαν το κατώφλι του.',
    history3: 'Ανακαινίστηκε πρόσφατα με πολύ μεράκι από τον πατέρα της οικογένειας, διατηρώντας τον χαρακτήρα και την αυθεντικότητά του.',
    historyQuote: '"Η φιλοξενία έγινε τρόπος ζωής, μια βαθιά ριζωμένη αξία, χτισμένη πάνω στην εμπιστοσύνη, τη φροντίδα και την αίσθηση του «ανήκειν»."',
    todayTitle: 'Σήμερα',
    today1: 'Το σπίτι ανοίγει τις πόρτες του για να υποδεχτεί και να φιλοξενήσει άλλες οικογένειες και παρέες όπως μόνο η οικογένεια Καρλή ξέρει!',
    today2: 'Κάθε επισκέπτης αντιμετωπίζεται με τη φροντίδα που προσφερόταν πάντα στα μέλη της οικογένειας: με απλές, ουσιαστικές χειρονομίες και μια αίσθηση οικειότητας που δύσκολα βρίσκει κανείς αλλού.',
    todayQuote: 'Στόχος είναι ο ξενώνας να αποτελέσει ένα σημείο αναφοράς για κάθε νέο επισκέπτη που αναζητά έναν τόπο αυθεντικό, ζεστό και αληθινό.',
    todayEnd: 'Έναν τόπο που σε κάνει να θέλεις να επιστρέφεις, ξανά και ξανά. Σαν να επιστρέφεις στο δικό σου σπίτι.',
    conceptTitle: 'Κεντρική Ιδέα',
    concept1: 'Όπως οι πέτρες ενώθηκαν για να χτιστεί το σπίτι, έτσι και οι άνθρωποι έρχονται κοντά μέσα από τη φιλοξενία.',
    concept2: 'Ένας τόπος όπου θάλασσα και βουνό συναντιούνται και άνθρωποι σμίγουν για να δημιουργήσουν εμπειρίες.',
    concept3: 'Κατά τη σχεδίαση αντλούμε έμπνευση από τις πέτρες και τα φυσικά τοπία της περιοχής, διατηρώντας την παραδοσιακή αισθητική του ξενώνα μέσα από μια σύγχρονη οπτική.',
    concept4: 'Όπως το σπίτι ανακαινίστηκε με φροντίδα και προσωπική εργασία από τον πατέρα της οικογένειας, έτσι και η χρήση χαρακτικών τεχνικών, σε εφαρμογές της οπτικής ταυτότητας, προσδίδει αυθεντικότητα, ενισχύοντας το στοιχείο του χειροποίητου.',
    meetingPoint: 'Σημείο συνάντησης.',
    contact: 'Επικοινωνία',
    terms: 'Όροι Χρήσης',
    privacy: 'Πολιτική Απορρήτου',
    allRightsReserved: 'All rights reserved.',
    galleryTitle: 'Gallery',
    bookingTitle: 'Ημερολόγιο & Κράτηση',
    bookingText: 'Επιλέξτε τις ημερομηνίες που σας ενδιαφέρουν και στείλτε μας το αίτημά σας. Θα επικοινωνήσουμε μαζί σας το συντομότερο.',
    bookingThanks: 'Ευχαριστούμε!',
    bookingSuccess: 'Το αίτημα σας στάλθηκε επιτυχώς. Θα επικοινωνήσουμε μαζί σας σύντομα.',
    selectedDates: 'Επιλεγμένες Ημερομηνίες:',
    checkIn: 'Άφιξη',
    checkOut: 'Αναχώρηση',
    guests: 'Αριθμός Επισκεπτών *',
    msg: 'Μήνυμα / Ιδιαίτερες ανάγκες',
    send: 'Αποστολή αιτήματος',
    sending: 'Αποστολή...',
    error: 'Προέκυψε σφάλμα κατά την αποστολή. Δοκιμάστε ξανά.',
    locationTitle: 'Τοποθεσία',
    locationText: 'Ο ξενώνας μας βρίσκεται στην μαγευτική Οκτωνιά, ιδανικό σημείο εκκίνησης για να εξερευνήσετε τις ομορφιές της Εύβοιας.',
    viewOnMap: 'Προβολή στον Χάρτη',
    cookieConsentAll: 'Αποδοχή όλων',
    cookieConsentEssential: 'Μόνο απαραίτητα',
    cookieText: 'Χρησιμοποιούμε cookies για να εξασφαλίσουμε την καλύτερη δυνατή εμπειρία πλοήγησης στο site μας και για τη λειτουργία των κρατήσεων.',
    close: 'Κλείσιμο'
  },
  en: {
    nav: {
      home: 'home',
      about: 'about us',
      gallery: 'gallery',
      booking: 'booking',
      location: 'location',
      contact: 'contact',
    },
    hero: {
      title: '"a meeting point\nevery summer"',
    },
    philosophy: {
      title: 'the philosophy of our family\nand our people',
      subtitle: 'Explore the Lithos logo to discover the experiences waiting for you in Evia.',
      exploreItems: [
        {
          id: 'sea' as const,
          title: 'sea',
          description: 'Enjoy the breeze of the Aegean and the azure waters of the Euboean Gulf. A haven of tranquility where the endless blue meets the sky, offering ultimate rejuvenation.',
          activities: ['Agia Anna Beach', 'Sarakiniko Beach', 'Walks in Evia', 'Fishing & Water Sports']
        },
        {
          id: 'mountain' as const,
          title: 'mountain',
          description: 'Discover the wild beauty and hidden paths of Evia. The energy of nature and the rugged landscapes invite you to unforgettable moments of exploration and peace.',
          activities: ['Forest Hiking', 'Nileus Gorge', 'Drymonas Waterfalls', 'Mountain Biking']
        },
        {
          id: 'home' as const,
          title: 'space / home',
          description: 'Respect for traditional architecture and a feeling of "belonging". A space made with care that embraces you.',
          activities: ['Relaxing by the fireplace', 'Reading in the attic', 'Local flavors', 'Peace & Solitude']
        },
        {
          id: 'sun' as const,
          title: 'sun / family',
          description: 'Moments of sharing, laughing, and joy under the Greek sun. Where family comes together to make unforgettable memories.',
          activities: ['Breakfast in the garden', 'Playing in nature', 'Afternoon coffee', 'Board games in the yard']
        },
        {
          id: 'bbq' as const,
          title: 'barbecue / welcome',
          description: 'The heart of hospitality beats here. Around the fire, we share flavors, stories, and the authentic Greek hospitality.',
          activities: ['BBQ Nights', 'Traditional food', 'Wine with friends', 'Feasts and music']
        }
      ]
    },
    guesthouse: 'guesthouse in Evia',
    visualIdentity: 'Visual Identity',
    lithos: 'Lithos',
    historyTitle: 'The History',
    history1: 'The unique stone house of the village, a meeting point for the Karli family. Carefree summers, unforgettable moments.',
    history2: 'This house embraced with its warmth and coziness, family, friends, and all those who crossed its threshold.',
    history3: 'Recently renovated with great care by the father of the family, preserving its character and authenticity.',
    historyQuote: '"Hospitality became a way of life, a deeply rooted value, built on trust, care, and the feeling of «belonging»."',
    todayTitle: 'Today',
    today1: 'The house opens its doors to welcome and host other families and groups of friends as only the Karli family knows how!',
    today2: 'Every guest is treated with the care that was always offered to family members: with simple, meaningful gestures and a sense of familiarity that is hard to find elsewhere.',
    todayQuote: 'The goal is for the guesthouse to be a reference point for every new guest looking for an authentic, warm, and real place.',
    todayEnd: 'A place that makes you want to return, again and again. As if returning to your own home.',
    conceptTitle: 'The Concept',
    concept1: 'Just as the stones were joined to build the house, so people come together through hospitality.',
    concept2: 'A place where sea and mountain meet and people mingle to create experiences.',
    concept3: 'During the design process, we draw inspiration from the stones and the natural landscapes of the area, preserving the traditional aesthetic of the guesthouse through a modern optical approach.',
    concept4: 'Just as the house was renovated with care and personal work by the father of the family, the use of engraving techniques in visual identity applications adds authenticity, enhancing the handmade element.',
    meetingPoint: 'Meeting point.',
    contact: 'Contact',
    terms: 'Terms of Use',
    privacy: 'Privacy Policy',
    allRightsReserved: 'All rights reserved.',
    galleryTitle: 'Gallery',
    bookingTitle: 'Calendar & Booking',
    bookingText: 'Select the dates you are interested in and send us your request. We will contact you as soon as possible.',
    bookingThanks: 'Thank you!',
    bookingSuccess: 'Your request has been sent successfully. We will contact you soon.',
    selectedDates: 'Selected Dates:',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    guests: 'Number of Guests *',
    msg: 'Message / Special requirements',
    send: 'Send Request',
    sending: 'Sending...',
    error: 'An error occurred during sending. Please try again.',
    locationTitle: 'Location',
    locationText: 'Our guesthouse is located in enchanting Oktonia, an ideal starting point to explore the beauties of Evia.',
    viewOnMap: 'View on map',
    cookieConsentAll: 'Accept all',
    cookieConsentEssential: 'Essential only',
    cookieText: 'We use cookies to ensure the best possible browsing experience on our site and for booking functionality.',
    close: 'Close'
  }
};
