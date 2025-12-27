export const INVESTMENTS = [
  {
    id: '1',
    buyer: {
      name: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      label: 'Buyer',
    },
    seller: {
      name: 'Wheeley',
      logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      label: 'Seller',
    },
    regulatedBy: 'RBI',
    overview: {
      unitCost: '1,00,000.00',
      xirr: '13.65%',
      unitLeft: '23/30',
      tenure: '90 Days',
      typeOfInterest: 'Compound',
      recourse: 'Seller',
    },
    investmentDetails: {
      unitValue: '₹1,00,000.00',
      couponRate: '12.5%',
      investmentValue: '₹1,03,561.64',
      unitPrice: '₹1,00,000.00',
      accruedInterest: '₹3,561.64',
      nextLiquidityEvent: '13/11/2025',
      liquidityEventAmount: '₹1,04,589.98',
      finalMaturityDate: '08/01/2028',
      expectedMaturityAmount: '₹1,36,708.72',
      units: {
        selected: 1,
        available: '23/30',
      },
      action: {
        buttonText: 'Continue with Payment',
        termsAccepted: false,
        termsLink: 'https://example.com/terms',
        privacyPolicyLink: 'https://example.com/privacy',
      },
    },
    extras: {
      riskMitigation: {
        title: 'Risk Mitigation',
        subtitle: 'Financial safeguards designed to reduce the risk of loss',
        items: [
          {
            value: '5%',
            label: 'Credit Enhancement',
            description: 'Additional financial buffer to reduce investor risk.',
          },
          {
            value: '125%',
            label: 'Collateral Cover',
            description: 'Collateral value exceeds the invested amount.',
          },
          {
            value: '',
            label: 'Secured Collateral Security',
            description: 'Investment secured against verified collateral.',
          },
          {
            value: '',
            label: 'Ample Assured Built-In Insurance',
            description: 'Insurance-backed protection for added safety.',
          },
        ],
      },
      shareDeal: {
        title: 'Share this Deal',
        options: [
          { label: 'Copy Link', icon: 'link', action: 'copy' },
          { label: 'WhatsApp', icon: 'whatsapp', action: 'whatsapp' },
          { label: 'Email', icon: 'email', action: 'email' },
        ],
      },
      faqs: [
        {
          id: 1,
          question: 'What is Invoice Discounting?',
          answer:
            'Invoice discounting is a financing method where businesses sell unpaid invoices to investors.',
        },
        {
          id: 2,
          question: 'How are the returns generated?',
          answer: 'Returns are generated from interest paid by the buyer over the tenure.',
        },
        {
          id: 3,
          question: 'How are the returns calculated?',
          answer: 'Returns depend on the investment amount, interest rate, and tenure.',
        },
      ],
    },
    platfromTrack: {
      stats: {
        campaigns: {
          value: 91,
          label: 'Campaigns',
        },
        repaidAmount: {
          value: '₹13,69,81,111.00',
          label: 'Repaid',
        },
        onTimeRepayment: {
          value: '100%',
          label: 'On-time Repayment',
          description: 'All the document for you to read and invest for understanding the deal.',
        },
      },

      documentsSummary: {
        title: 'Documents',
        description: 'All the document for you to read and invest for understanding the deal.',
        tags: [
          {
            label: 'Invoice',
          },
          {
            label: 'Agreement',
          },
          {
            label: 'PDC',
          },
        ],
      },

      documents: {
        title: 'Documents',
        description: 'All the document for you to read and invest for understanding the deal.',
        actions: [
          {
            label: 'Due Diligence',
            icon: 'download',
            action: 'download_due_diligence',
          },
          {
            label: 'Assured Certificate',
            icon: 'download',
            action: 'download_assured_certificate',
          },
        ],
      },

      badge: {
        initials: 'B',
        image: 'https://i.pravatar.cc/150?img=12', // optional avatar
      },
    },
    opportunity: {
      title: 'Opportunity Summary',
      description:
        'Information provided for all previous campaigns for which repayment has been completed',

      seller: {
        title: 'About Seller',
        description: 'Annapurna Feeds deals in FMCG food sector.',
      },

      howItWorks: {
        title: 'How it works',
        steps: ['Step 1', 'Step 2', 'Step 3'],
      },

      receivablesAssignment: {
        title: 'Receivables Assignment',
        description:
          'NBFC assigns the right to receive payment against the distributed invoices. (Visual shows buyer → NBFC → seller)',
        action: {
          label: 'Know more →',
          link: '/receivables-details',
        },
      },
    },
    about: {
      aboutBuyer: {
        title: 'About Buyer',
        description:
          'Sampoorna Feeds Pvt Ltd is a Phagwara, Punjab-based company specializing in manufacturing and selling a range of animal feed, including poultry and cattle feed, primarily produced through contract farming.',
      },

      aboutTrustee: {
        title: 'About the Trustee',
        description:
          'Beacon Trusteeship Limited is a SEBI-registered debenture trustee that provides a wide range of trustee services, including Debenture Trustee Services, Security Trustee Services, Trustee to Alternate Investment Funds (AIF), Trustee to Securitization transactions, Bond Trusteeship Services, Escrow Services, and Safekeeping.',
      },

      aboutNBFC: {
        title: 'About NBFC',
        description:
          'Gangotree Baitar Private Limited (GBPL) is a Non Deposit-Taking NBFC registered with RBI having registration number as 05.02902. Backed by a team of qualified investment professionals, GBPL specializes in providing Invoice Discounting and Supply Chain Financing to Corporates in India.',
      },
    },
  },

  {
    id: '2',
    buyer: {
      name: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      label: 'Buyer',
    },
    seller: {
      name: 'Cloudnine',
      logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      label: 'Seller',
    },
    regulatedBy: 'RBI',
    overview: {
      unitCost: '1,50,000.00',
      xirr: '13.20%',
      unitLeft: '15/25',
      tenure: '120 Days',
      typeOfInterest: 'Compound',
      recourse: 'Seller',
    },
    investmentDetails: {
      unitValue: '₹1,50,000.00',
      couponRate: '13.2%',
      investmentValue: '₹1,54,500.00',
      unitPrice: '₹1,50,000.00',
      accruedInterest: '₹4,500.00',
      nextLiquidityEvent: '21/12/2025',
      liquidityEventAmount: '₹1,58,200.00',
      finalMaturityDate: '20/02/2028',
      expectedMaturityAmount: '₹1,72,800.00',
      units: { selected: 1, available: '15/25' },
      action: {
        buttonText: 'Continue with Payment',
        termsAccepted: false,
        termsLink: 'https://example.com/terms',
        privacyPolicyLink: 'https://example.com/privacy',
      },
    },
    extras: {
      riskMitigation: {
        title: 'Risk Mitigation',
        subtitle: 'Financial safeguards designed to reduce the risk of loss',
        items: [
          { title: '5% Credit Enhancement', description: 'Additional financial buffer.' },
          { title: '125% Collateral Cover', description: 'Higher security coverage.' },
          { title: 'Secured Collateral', description: 'Assets secured against investment.' },
        ],
      },
      shareDeal: {
        title: 'Share this Deal',
        options: [
          { label: 'Copy Link', icon: 'link', action: 'copy' },
          { label: 'WhatsApp', icon: 'whatsapp', action: 'whatsapp' },
          { label: 'Email', icon: 'email', action: 'email' },
        ],
      },
      faqs: [
        {
          id: 1,
          question: 'What is Invoice Discounting?',
          answer: 'It allows early payment against invoices.',
        },
        { id: 2, question: 'How are returns generated?', answer: 'From buyer interest payments.' },
        {
          id: 3,
          question: 'How are returns calculated?',
          answer: 'Based on tenure and interest rate.',
        },
      ],
    },
  },

  {
    id: '3',
    buyer: {
      name: 'Myntra',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Myntra_Logo.png',
      label: 'Buyer',
    },
    seller: {
      name: 'StyleHub',
      logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      label: 'Seller',
    },
    regulatedBy: 'RBI',
    overview: {
      unitCost: '80,000.00',
      xirr: '13.75%',
      unitLeft: '18/20',
      tenure: '60 Days',
      typeOfInterest: 'Compound',
      recourse: 'Seller',
    },
    investmentDetails: {
      unitValue: '₹80,000.00',
      couponRate: '13.75%',
      investmentValue: '₹82,600.00',
      unitPrice: '₹80,000.00',
      accruedInterest: '₹2,600.00',
      nextLiquidityEvent: '05/10/2025',
      liquidityEventAmount: '₹83,950.00',
      finalMaturityDate: '15/12/2027',
      expectedMaturityAmount: '₹96,400.00',
      units: { selected: 1, available: '18/20' },
      action: { buttonText: 'Continue with Payment', termsAccepted: false },
    },
    extras: {
      riskMitigation: {
        title: 'Risk Mitigation',
        subtitle: 'Financial safeguards designed to reduce the risk of loss',
        items: [
          { title: '5% Credit Enhancement', description: 'Additional financial buffer.' },
          { title: '125% Collateral Cover', description: 'Exceeds investment value.' },
        ],
      },
      shareDeal: {
        title: 'Share this Deal',
        options: [
          { label: 'Copy Link', icon: 'link', action: 'copy' },
          { label: 'WhatsApp', icon: 'whatsapp', action: 'whatsapp' },
          { label: 'Email', icon: 'email', action: 'email' },
        ],
      },
      faqs: [
        {
          id: 1,
          question: 'What is Invoice Discounting?',
          answer: 'Early invoice-based financing.',
        },
        { id: 2, question: 'How are returns generated?', answer: 'Via buyer interest payments.' },
        {
          id: 3,
          question: 'How are returns calculated?',
          answer: 'Based on tenure and interest rate.',
        },
      ],
    },
  },
  {
    id: '4',
    buyer: {
      name: 'Ajio',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Ajio-Logo.svg',
      label: 'Buyer',
    },
    seller: {
      name: 'RetailKing',
      logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      label: 'Seller',
    },
    regulatedBy: 'RBI',
    overview: {
      unitCost: '1,20,000.00',
      xirr: '13.75%',
      unitLeft: '10/20',
      tenure: '150 Days',
      typeOfInterest: 'Compound',
      recourse: 'Seller',
    },
    investmentDetails: {
      unitValue: '₹1,20,000.00',
      couponRate: '13.5%',
      investmentValue: '₹1,24,800.00',
      unitPrice: '₹1,20,000.00',
      accruedInterest: '₹4,800.00',
      nextLiquidityEvent: '28/02/2026',
      liquidityEventAmount: '₹1,30,200.00',
      finalMaturityDate: '20/04/2028',
      expectedMaturityAmount: '₹1,45,000.00',
      units: { selected: 1, available: '10/20' },
      action: { buttonText: 'Continue with Payment', termsAccepted: false },
    },
    extras: {
      riskMitigation: {
        title: 'Risk Mitigation',
        subtitle: 'Financial safeguards designed to reduce the risk of loss',
        items: [
          { title: 'Secured Collateral', description: 'Asset-backed protection.' },
          { title: 'Credit Enhancement', description: 'Improved investor safety.' },
        ],
      },
      shareDeal: {
        title: 'Share this Deal',
        options: [
          { label: 'Copy Link', icon: 'link', action: 'copy' },
          { label: 'WhatsApp', icon: 'whatsapp', action: 'whatsapp' },
          { label: 'Email', icon: 'email', action: 'email' },
        ],
      },
      faqs: [
        { id: 1, question: 'Is this secured?', answer: 'Yes, asset-backed security is provided.' },
        { id: 2, question: 'What is tenure?', answer: '150 days.' },
      ],
    },
  },
  {
    id: '5',
    buyer: {
      name: 'Nykaa',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Nykaa_logo.png',
      label: 'Buyer',
    },
    seller: {
      name: 'BeautyCorp',
      logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      label: 'Seller',
    },
    regulatedBy: 'RBI',
    overview: {
      unitCost: '95,000.00',
      xirr: '13.10%',
      unitLeft: '22/30',
      tenure: '90 Days',
      typeOfInterest: 'Compound',
      recourse: 'Seller',
    },
    investmentDetails: {
      unitValue: '₹95,000.00',
      couponRate: '13.1%',
      investmentValue: '₹97,950.00',
      unitPrice: '₹95,000.00',
      accruedInterest: '₹2,950.00',
      nextLiquidityEvent: '12/11/2025',
      liquidityEventAmount: '₹1,01,200.00',
      finalMaturityDate: '30/01/2028',
      expectedMaturityAmount: '₹1,10,500.00',
      units: { selected: 1, available: '22/30' },
      action: { buttonText: 'Continue with Payment', termsAccepted: false },
    },
    extras: {
      riskMitigation: {
        title: 'Risk Mitigation',
        subtitle: 'Financial safeguards designed to reduce the risk of loss',
        items: [{ title: 'Collateral Cover', description: 'Assets secured against risk.' }],
      },
      shareDeal: {
        title: 'Share this Deal',
        options: [
          { label: 'Copy Link', icon: 'link', action: 'copy' },
          { label: 'WhatsApp', icon: 'whatsapp', action: 'whatsapp' },
        ],
      },
      faqs: [{ id: 1, question: 'Is this safe?', answer: 'Yes, protected by collateral.' }],
    },
  },
  {
    id: '6',
    buyer: {
      name: 'Zomato',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png',
      label: 'Buyer',
    },
    seller: {
      name: 'Foodies',
      logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      label: 'Seller',
    },
    regulatedBy: 'RBI',
    overview: {
      unitCost: '1,10,000.00',
      xirr: '13.00%',
      unitLeft: '12/20',
      tenure: '120 Days',
      typeOfInterest: 'Compound',
      recourse: 'Seller',
    },
    investmentDetails: {
      unitValue: '₹1,10,000.00',
      couponRate: '13.0%',
      investmentValue: '₹1,13,600.00',
      unitPrice: '₹1,10,000.00',
      accruedInterest: '₹3,600.00',
      nextLiquidityEvent: '18/12/2025',
      liquidityEventAmount: '₹1,18,900.00',
      finalMaturityDate: '05/03/2028',
      expectedMaturityAmount: '₹1,30,000.00',
      units: { selected: 1, available: '12/20' },
      action: { buttonText: 'Continue with Payment', termsAccepted: false },
    },
    extras: {
      riskMitigation: {
        title: 'Risk Mitigation',
        subtitle: 'Financial safeguards designed to reduce the risk of loss',
        items: [{ title: 'Credit Protection', description: 'Safeguard against defaults.' }],
      },
      shareDeal: {
        title: 'Share this Deal',
        options: [{ label: 'Copy Link', icon: 'link', action: 'copy' }],
      },
      faqs: [{ id: 1, question: 'What is tenure?', answer: '120 days.' }],
    },
  },
  {
    id: '7',
    buyer: {
      name: 'Swiggy',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png',
      label: 'Buyer',
    },
    seller: {
      name: 'QuickBite',
      logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      label: 'Seller',
    },
    regulatedBy: 'RBI',
    overview: {
      unitCost: '90,000.00',
      xirr: '12.75%',
      unitLeft: '20/25',
      tenure: '75 Days',
      typeOfInterest: 'Compound',
      recourse: 'Seller',
    },
    investmentDetails: {
      unitValue: '₹90,000.00',
      couponRate: '12.75%',
      investmentValue: '₹92,500.00',
      unitPrice: '₹90,000.00',
      accruedInterest: '₹2,500.00',
      nextLiquidityEvent: '11/10/2025',
      liquidityEventAmount: '₹95,000.00',
      finalMaturityDate: '10/01/2028',
      expectedMaturityAmount: '₹1,02,000.00',
      units: { selected: 1, available: '20/25' },
      action: { buttonText: 'Continue with Payment', termsAccepted: false },
    },
    extras: {
      riskMitigation: {
        title: 'Risk Mitigation',
        subtitle: 'Financial safeguards designed to reduce the risk of loss',
        items: [{ title: 'Collateral Cover', description: 'Assets secured.' }],
      },
      shareDeal: {
        title: 'Share this Deal',
        options: [{ label: 'Copy Link', icon: 'link', action: 'copy' }],
      },
      faqs: [{ id: 1, question: 'Is this safe?', answer: 'Yes, collateral backed.' }],
    },
  },
  {
    id: '8',
    buyer: {
      name: 'Reliance',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Reliance_Industries_Logo.svg',
      label: 'Buyer',
    },
    seller: {
      name: 'JioMart',
      logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      label: 'Seller',
    },
    regulatedBy: 'RBI',
    overview: {
      unitCost: '2,00,000.00',
      xirr: '13.20%',
      unitLeft: '8/15',
      tenure: '180 Days',
      typeOfInterest: 'Compound',
      recourse: 'Seller',
    },
    investmentDetails: {
      unitValue: '₹2,00,000.00',
      couponRate: '13.2%',
      investmentValue: '₹2,06,000.00',
      unitPrice: '₹2,00,000.00',
      accruedInterest: '₹6,000.00',
      nextLiquidityEvent: '20/01/2026',
      liquidityEventAmount: '₹2,12,500.00',
      finalMaturityDate: '15/05/2028',
      expectedMaturityAmount: '₹2,35,000.00',
      units: { selected: 1, available: '8/15' },
      action: { buttonText: 'Continue with Payment', termsAccepted: false },
    },
    extras: {
      riskMitigation: {
        title: 'Risk Mitigation',
        subtitle: 'Financial safeguards designed to reduce the risk of loss',
        items: [{ title: 'Strong Collateral', description: 'High-value asset backing.' }],
      },
      shareDeal: {
        title: 'Share this Deal',
        options: [{ label: 'Copy Link', icon: 'link', action: 'copy' }],
      },
      faqs: [{ id: 1, question: 'Is this secured?', answer: 'Yes, backed by strong collateral.' }],
    },
  },
  {
    id: '9',
    buyer: {
      name: 'Tata',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Tata_logo.svg',
      label: 'Buyer',
    },
    seller: {
      name: 'TataSteel',
      logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      label: 'Seller',
    },
    regulatedBy: 'RBI',
    overview: {
      unitCost: '1,75,000.00',
      xirr: '13.60%',
      unitLeft: '14/20',
      tenure: '150 Days',
      typeOfInterest: 'Compound',
      recourse: 'Seller',
    },
    investmentDetails: {
      unitValue: '₹1,75,000.00',
      couponRate: '13.6%',
      investmentValue: '₹1,79,200.00',
      unitPrice: '₹1,75,000.00',
      accruedInterest: '₹4,200.00',
      nextLiquidityEvent: '22/01/2026',
      liquidityEventAmount: '₹1,85,300.00',
      finalMaturityDate: '15/04/2028',
      expectedMaturityAmount: '₹1,98,000.00',
      units: { selected: 1, available: '14/20' },
      action: { buttonText: 'Continue with Payment', termsAccepted: false },
    },
    extras: {
      riskMitigation: {
        title: 'Risk Mitigation',
        subtitle: 'Financial safeguards designed to reduce the risk of loss',
        items: [{ title: 'High Credit Rating', description: 'Strong financial backing.' }],
      },
      shareDeal: {
        title: 'Share this Deal',
        options: [{ label: 'Copy Link', icon: 'link', action: 'copy' }],
      },
      faqs: [{ id: 1, question: 'Is this safe?', answer: 'Backed by Tata group.' }],
    },
  },
  {
    id: '10',
    buyer: {
      name: 'Infosys',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg',
      label: 'Buyer',
    },
    seller: {
      name: 'TechSoft',
      logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      label: 'Seller',
    },
    regulatedBy: 'RBI',
    overview: {
      unitCost: '1,30,000.00',
      xirr: '13.90%',
      unitLeft: '19/25',
      tenure: '100 Days',
      typeOfInterest: 'Compound',
      recourse: 'Seller',
    },
    investmentDetails: {
      unitValue: '₹1,30,000.00',
      couponRate: '13.9%',
      investmentValue: '₹1,34,800.00',
      unitPrice: '₹1,30,000.00',
      accruedInterest: '₹4,800.00',
      nextLiquidityEvent: '10/12/2025',
      liquidityEventAmount: '₹1,39,200.00',
      finalMaturityDate: '28/03/2028',
      expectedMaturityAmount: '₹1,50,000.00',
      units: { selected: 1, available: '19/25' },
      action: { buttonText: 'Continue with Payment', termsAccepted: false },
    },
    extras: {
      riskMitigation: {
        title: 'Risk Mitigation',
        subtitle: 'Financial safeguards designed to reduce the risk of loss',
        items: [{ title: 'Stable Returns', description: 'Predictable investment returns.' }],
      },
      shareDeal: {
        title: 'Share this Deal',
        options: [{ label: 'Copy Link', icon: 'link', action: 'copy' }],
      },
      faqs: [{ id: 1, question: 'What is the tenure?', answer: '100 days.' }],
    },
  },
  {
    id: '11',
    buyer: {
      name: 'HDFC',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/HDFC_Bank_Logo.svg',
      label: 'Buyer',
    },
    seller: {
      name: 'FinServe',
      logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      label: 'Seller',
    },
    regulatedBy: 'RBI',
    overview: {
      unitCost: '1,60,000.00',
      xirr: '13.10%',
      unitLeft: '16/25',
      tenure: '110 Days',
      typeOfInterest: 'Compound',
      recourse: 'Seller',
    },
    investmentDetails: {
      unitValue: '₹1,60,000.00',
      couponRate: '13.1%',
      investmentValue: '₹1,64,800.00',
      unitPrice: '₹1,60,000.00',
      accruedInterest: '₹4,800.00',
      nextLiquidityEvent: '14/12/2025',
      liquidityEventAmount: '₹1,70,200.00',
      finalMaturityDate: '30/03/2028',
      expectedMaturityAmount: '₹1,85,000.00',
      units: { selected: 1, available: '16/25' },
      action: { buttonText: 'Continue with Payment', termsAccepted: false },
    },
    extras: {
      riskMitigation: {
        title: 'Risk Mitigation',
        subtitle: 'Financial safeguards designed to reduce the risk of loss',
        items: [{ title: 'Bank Grade Security', description: 'Trusted institutional protection.' }],
      },
      shareDeal: {
        title: 'Share this Deal',
        options: [{ label: 'Copy Link', icon: 'link', action: 'copy' }],
      },
      faqs: [
        { id: 1, question: 'Is investment safe?', answer: 'Yes, backed by reputed institutions.' },
      ],
    },
  },
];
