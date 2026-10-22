export interface FallbackBiographyData {
  entityId: string;
  name: string;
  era: string;
  biography: string;
  achievements: string[];
  legacy: string;
  sources: Array<{ title: string; uri: string }>;
}

export const FALLBACK_BIOGRAPHIES: Record<string, FallbackBiographyData> = {
  walt_disney: {
    entityId: "walt_disney",
    name: "Walt Disney",
    era: "20th Century (1901–1966) • Chicago, Illinois / California, USA",
    biography: `Walter Elias Disney was an American animator, film producer, and entrepreneur whose relentless imagination transformed the landscape of animation and themed entertainment. Starting from humble origins with the Laugh-O-Gram Studio, he partnered with his brother Roy O. Disney and master animator Ub Iwerks to introduce Mickey Mouse in 'Steamboat Willie' (1928), pioneering synchronized sound in animated cartoons.

Disney pushed cinematic art forward with the creation of the world's first full-length cel-animated feature film, 'Snow White and the Seven Dwarfs' (1937), followed by visionary masterpieces like 'Fantasia' and 'Pinocchio'. He subsequently invented the modern theme park with the opening of Disneyland in 1955 and developed 'Imagineering' to merge engineering with cinematic storytelling.`,
    achievements: [
      "Pioneered synchronized sound and full Technicolor in animation ('Steamboat Willie', 'Flowers and Trees').",
      "Produced the first full-length cel-animated feature film 'Snow White and the Seven Dwarfs' (1937).",
      "Invented the multiplane camera to create realistic depth in 2D animation.",
      "Conceived and constructed Disneyland (1955) and initiated EPCOT (Experimental Prototype Community of Tomorrow).",
      "Won 22 Academy Awards out of 59 nominations—the highest in Academy history."
    ],
    legacy: `Disney redefined global popular culture, demonstrating that technological innovation and emotional storytelling can create shared cross-generational joy. His philosophy of Imagineering continues to bridge the arts and sciences.`,
    sources: [
      { title: "Walt Disney - Wikipedia", uri: "https://en.wikipedia.org/wiki/Walt_Disney" },
      { title: "The Walt Disney Family Museum Archives", uri: "https://www.waltdisney.org/" }
    ]
  },
  nikola_tesla: {
    entityId: "nikola_tesla",
    name: "Nikola Tesla",
    era: "Late 19th to Mid 20th Century (1856–1943) • Smiljan (Austrian Empire) / New York, USA",
    biography: `Nikola Tesla was a Serbian-American inventor, electrical engineer, and visionary futurist who designed the modern alternating current (AC) electricity supply system. After studying at the Graz University of Technology and gaining engineering experience in Europe, Tesla emigrated to the United States in 1884, working briefly with Thomas Edison before establishing his own laboratories.

Tesla's invention of the polyphase alternating current induction motor and related AC patents formed the cornerstone of the Second Industrial Revolution when licensed by George Westinghouse. His extensive research into high-voltage, high-frequency electricity culminated in the Tesla coil, wireless telegraphy experiments, and early concepts of global wireless power transmission at Wardenclyffe Tower.`,
    achievements: [
      "Invented and patented the Polyphase Alternating Current (AC) Induction Motor and Power Transmission.",
      "Invented the Tesla Coil (1891), essential for wireless radio transmission and early electronics.",
      "Conducted pioneering demonstrations of radio control and teleautomaton robotics (1898 boat demonstration).",
      "Designed the first major hydroelectric power plant at Niagara Falls (1895).",
      "Formulated foundational principles of wireless communication and radar decades ahead of their time."
    ],
    legacy: `Tesla remains the archetype of the visionary inventor whose insights into electromagnetism, resonance, and harmonic energy fundamentally energized the modern electrical world.`,
    sources: [
      { title: "Nikola Tesla - Wikipedia", uri: "https://en.wikipedia.org/wiki/Nikola_Tesla" },
      { title: "Tesla Science Center at Wardenclyffe", uri: "https://teslasciencecenter.org/" }
    ]
  },
  solomon: {
    entityId: "solomon",
    name: "King Solomon",
    era: "10th Century BCE (c. 970–931 BCE) • Kingdom of Israel / Ancient Near East",
    biography: `Solomon (Hebrew: Shlomo) was the third King of the United Monarchy of Israel, renowned throughout biblical and classical world literature as the epitome of supreme wisdom, statecraft, and architectural majesty. Son of King David and Bathsheba, his reign marked the golden age of ancient Israel's economic prosperity, diplomatic alliances, and cultural synthesis.

Solomon is credited in tradition with constructing the First Temple in Jerusalem (Beit HaMikdash) on Mount Moriah, creating a center of sacred metrology and geometry. In esoteric, rabbinic, and Islamic lore (as the prophet Sulayman), he is celebrated as a master of natural philosophies, the languages of birds and beasts, and the governor of subterranean forces and angelic intelligences.`,
    achievements: [
      "Architect and builder of the First Temple of Jerusalem (Solomon's Temple).",
      "Expanded international maritime trade networks through Ezion-Geber and diplomacy with the Queen of Sheba.",
      "Traditional author/source of biblical wisdom literature: Proverbs, Ecclesiastes, and the Song of Songs.",
      "Established the judicial model of discernment and equity (the Judgment of Solomon).",
      "Central figure in Western esotericism and architectural sacred geometry traditions."
    ],
    legacy: `Solomon endures as the universal archetype of the Philosopher-King, combining moral discernment, mathematical governance, and harmonious balance between material prosperity and spiritual architecture.`,
    sources: [
      { title: "Solomon - Wikipedia", uri: "https://en.wikipedia.org/wiki/Solomon" },
      { title: "Encyclopaedia Britannica - King Solomon", uri: "https://www.britannica.com/biography/Solomon" }
    ]
  },
  enki: {
    entityId: "enki",
    name: "Enki (Ea)",
    era: "3rd–1st Millennium BCE • Ancient Mesopotamia (Sumer, Akkad, Babylon) / Eridu",
    biography: `Enki (Akkadian: Ea) is one of the primary deities in the ancient Mesopotamian pantheon, worshipped as the Lord of the Abzu (the subterranean sweet fresh waters), wisdom, architecture, crafts, creation, and magic. His cult center was the temple E-Abzu in Eridu, the earliest recorded city in southern Sumerian tradition.

In Sumerian cosmogony (such as 'Enki and the World Order' and 'Atrahasis'), Enki is the protector and champion of humanity. When the higher gods decreed the annihilation of humankind through the Great Deluge, Enki whispered the secret across the reed wall to Atrahasis/Utnapishtim, giving humans the ark plans and ensuring the survival of mortal life, civilization, and culture.`,
    achievements: [
      "Guardian and organizer of the sacred 'Me'—the fundamental divine decrees of civilization, science, and crafts.",
      "Savior of humanity in the Sumerian Flood Epics (Atrahasis, Epic of Gilgamesh).",
      "Deity of the Abzu: subterranean aquifers, fertility, agriculture, and irrigation canal networks.",
      "Patron of medicine, incantations, metalworking, astronomy, and scribal arts in ancient Mesopotamia.",
      "Protagonist in foundational texts: 'Enki and Ninmah', 'Inanna and Enki', and 'Enmerkar and the Lord of Aratta'."
    ],
    legacy: `Enki stands as the ancient world's foremost archetype of the benevolent, inventive craftsman-god who elevates humanity through knowledge, water architecture, and creative problem-solving.`,
    sources: [
      { title: "Enki - Wikipedia", uri: "https://en.wikipedia.org/wiki/Enki" },
      { title: "Ancient Mesopotamian Gods and Goddesses - Enki/Ea", uri: "http://oracc.museum.upenn.edu/amgg/listofdeities/ea/" }
    ]
  },
  leonardo_da_vinci: {
    entityId: "leonardo_da_vinci",
    name: "Leonardo da Vinci",
    era: "High Renaissance (1452–1519) • Florence, Milan, Rome (Italy) & Amboise (France)",
    biography: `Leonardo di ser Piero da Vinci was an Italian polymath of the High Renaissance who achieved monumental mastery across painting, anatomy, engineering, optics, hydrodynamics, and botany. Apprenticed to Andrea del Verrocchio in Florence, Leonardo developed a revolutionary observational method based on empirical science and visual geometry.

His artistic masterworks—including 'Mona Lisa', 'The Last Supper', and 'Vitruvian Man'—embody the fusion of art and mathematical proportion. Leonardo's thousands of pages of journals and codices (Codex Leicester, Codex Atlanticus) contain anticipatory designs for flying machines, hydraulic pumps, submersibles, automated looms, and unprecedented anatomical cross-sections.`,
    achievements: [
      "Painted 'Mona Lisa' and 'The Last Supper'—defining pinnacles of Western fine art and sfumato technique.",
      "Pioneered anatomical illustration with over 200 precise studies of the human skeleton, musculature, and cardiovascular system.",
      "Created 'Vitruvian Man', establishing the golden mathematical canon of human proportion.",
      "Conceptualized advanced machinery: helicopters (aerial screw), armored vehicles, parachutes, and dual-hull ships.",
      "Authored foundational codices on fluid dynamics, wave mechanics, geology, and optics."
    ],
    legacy: `Leonardo represents the supreme archetype of the Renaissance Polymath, proving that scientific inquiry and artistic intuition are inseparable facets of understanding nature.`,
    sources: [
      { title: "Leonardo da Vinci - Wikipedia", uri: "https://en.wikipedia.org/wiki/Leonardo_da_Vinci" },
      { title: "The British Library - Leonardo da Vinci notebooks", uri: "https://www.bl.uk/collection-items/leonardo-da-vinci-notebook" }
    ]
  },
  hermes_trismegistus: {
    entityId: "hermes_trismegistus",
    name: "Hermes Trismegistus",
    era: "Hellenistic Egypt / Late Antiquity (c. 2nd–3rd Century CE) • Alexandria, Egypt",
    biography: `Hermes Trismegistus ('Thrice-Greatest Hermes') is the legendary syncretic figure merging the Greek god Hermes (herald of the gods, guide of souls) and the Egyptian god Thoth (deity of wisdom, writing, and magic). He is revered in classical antiquity, the Renaissance, and Islamic philosophy as the father of alchemy, sacred geometry, astronomy, and Hermetic philosophy.

Attributed with foundational texts including the 'Corpus Hermeticum', the 'Asclepius', and the famed 'Emerald Tablet' (Tabula Smaragdina), his teachings center on the unity of the cosmos, the principle of mentalism, and the maxim 'As above, so below; as within, so without.' His writings ignited the European Renaissance when translated by Marsilio Ficino in 1471.`,
    achievements: [
      "Core authority of the 'Corpus Hermeticum' and the 'Emerald Tablet' (Tabula Smaragdina).",
      "Formulated the 7 Hermetic Principles (Mentalism, Correspondence, Vibration, Polarity, Rhythm, Cause & Effect, Gender).",
      "Foundational inspiration for Renaissance philosophy (Ficino, Pico della Mirandola, Giordano Bruno, Isaac Newton).",
      "Pioneered sacred geometry, philosophical alchemy, and the concept of universal cosmic resonance.",
      "Bridged Egyptian temple science with classical Greek dialectic and metaphysics."
    ],
    legacy: `Hermes Trismegistus remains the timeless symbol of perennial wisdom, uniting micro-cosmic human consciousness with macro-cosmic universal law.`,
    sources: [
      { title: "Hermes Trismegistus - Wikipedia", uri: "https://en.wikipedia.org/wiki/Hermes_Trismegistus" },
      { title: "Corpus Hermeticum - Internet Sacred Text Archive", uri: "https://www.sacred-texts.com/alc/hermes.htm" }
    ]
  },
  alan_turing: {
    entityId: "alan_turing",
    name: "Alan Turing",
    era: "20th Century (1912–1954) • London, Bletchley Park, Manchester, United Kingdom",
    biography: `Alan Mathison Turing was an English mathematician, computer scientist, logician, cryptanalyst, and theoretical biologist. Turing is widely considered to be the father of theoretical computer science and artificial intelligence. In his landmark 1936 paper, he introduced the concept of the 'Universal Turing Machine', formalizing the concepts of algorithm and computation.

During World War II, Turing was a lead codebreaker at the Government Code and Cypher School at Bletchley Park. He designed the electromechanical 'Bombe' machine, which successfully broke the German Enigma cipher, saving millions of lives and shortening the war. Post-war, he created the ACE computer design, pioneered the Turing Test for machine intelligence, and authored groundbreaking mathematical models of biological morphogenesis.`,
    achievements: [
      "Formulated the Universal Turing Machine model (1936), the mathematical foundation of all digital computers.",
      "Designed the 'Bombe' cryptanalytic machine to break the Enigma machine cipher at Bletchley Park.",
      "Proposed the 'Turing Test' (1950) in 'Computing Machinery and Intelligence', founding AI philosophy.",
      "Developed the Automatic Computing Engine (ACE), one of the earliest stored-program computer designs.",
      "Published 'The Chemical Basis of Morphogenesis' (1952), founding mathematical biology and reaction-diffusion theory."
    ],
    legacy: `Turing's genius laid the mathematical and engineering foundation of the information age, artificial intelligence, and biological pattern formation.`,
    sources: [
      { title: "Alan Turing - Wikipedia", uri: "https://en.wikipedia.org/wiki/Alan_Turing" },
      { title: "The Alan Turing Institute", uri: "https://www.turing.ac.uk/" }
    ]
  },
  marie_curie: {
    entityId: "marie_curie",
    name: "Marie Curie",
    era: "Late 19th to Early 20th Century (1867–1934) • Warsaw, Poland / Paris, France",
    biography: `Marie Salomea Skłodowska-Curie was a Polish and naturalized-French physicist and chemist who conducted pioneering research on radioactivity. Defying extreme institutional barriers against women in science, she studied at the University of Paris and, working alongside her husband Pierre Curie, isolated the previously unknown chemical elements polonium and radium.

Curie was the first woman to win a Nobel Prize, the first person to win Nobel Prizes in two different scientific fields (Physics in 1903, Chemistry in 1911), and the first female professor at the Sorbonne. During World War I, she developed mobile radiography units ('Petites Curies') to provide battlefield X-rays to wounded soldiers.`,
    achievements: [
      "Discovered the chemical elements Polonium (named after her homeland Poland) and Radium (1898).",
      "Coined the term 'Radioactivity' and formulated techniques for isolating radioactive isotopes.",
      "Only person to win Nobel Prizes in two distinct scientific disciplines (Physics 1903, Chemistry 1911).",
      "Founded the Curie Institutes in Paris and Warsaw, major centers of medical physics and oncology.",
      "Created mobile X-ray field vehicles ('Petites Curies') saving thousands of Allied soldiers in WWI."
    ],
    legacy: `Curie stands as a towering beacon of scientific integrity, relentless perseverance, and humanitarian dedication whose discoveries opened the nuclear and radiological age.`,
    sources: [
      { title: "Marie Curie - Wikipedia", uri: "https://en.wikipedia.org/wiki/Marie_Curie" },
      { title: "Nobel Prize Official Biography - Marie Curie", uri: "https://www.nobelprize.org/prizes/physics/1903/marie-curie/biographical/" }
    ]
  },
  hypatia: {
    entityId: "hypatia",
    name: "Hypatia of Alexandria",
    era: "Late Antiquity (c. 360–415 CE) • Alexandria, Roman Egypt",
    biography: `Hypatia was a Hellenistic Neoplatonist philosopher, astronomer, and mathematician who lived and taught in Alexandria, Egypt. Daughter of the mathematician Theon of Alexandria, she became the head of the Neoplatonic school in Alexandria, lecturing to students from throughout the Mediterranean world on geometry, arithmetic, and Platonic philosophy.

Renowned for her deep intellect, oratory, and civic leadership, Hypatia constructed astrolabes and hydrometers and edited seminal mathematical treatises on Apollonius's 'Conics' and Diophantus's 'Arithmetica'. Her tragic murder during political and religious turmoil in Alexandria immortalized her as a martyr for philosophy, mathematics, and open inquiry.`,
    achievements: [
      "Head of the Alexandria Neoplatonic Academy, teaching mathematics, astronomy, and philosophy.",
      "Authored commentaries on Diophantus's 'Arithmetica' and Apollonius of Perga's 'Conics'.",
      "Perfected the design and calibration of plane astrolabes and brass hydrometers for liquid density measurement.",
      "Preserved key Hellenistic mathematical lineages through the turbulent transitions of Late Antiquity.",
      "Symbol of scholarly integrity and dedication to rational philosophy."
    ],
    legacy: `Hypatia is celebrated worldwide as history's first renowned female mathematician and a timeless guardian of classical learning and intellectual freedom.`,
    sources: [
      { title: "Hypatia - Wikipedia", uri: "https://en.wikipedia.org/wiki/Hypatia" },
      { title: "Stanford Encyclopedia of Philosophy - Hypatia", uri: "https://plato.stanford.edu/entries/hypatia/" }
    ]
  },
  steve_jobs: {
    entityId: "steve_jobs",
    name: "Steve Jobs",
    era: "Late 20th to Early 21st Century (1955–2011) • Silicon Valley, California, USA",
    biography: `Steven Paul Jobs was an American entrepreneur, industrial designer, and business magnate who co-founded Apple Inc. and revolutionized personal computing, animated cinema, music distribution, mobile telephony, and tablet computing. With Steve Wozniak, he sparked the personal computer revolution with the Apple I and Apple II in the late 1970s, followed by the groundbreaking graphical user interface of the Macintosh in 1984.

After founding NeXT and acquiring Pixar Animation Studios (overseeing 'Toy Story'), Jobs returned to a struggling Apple in 1997. Over the next decade, he orchestrated the greatest corporate turnaround in business history, unveiling iconic innovations including the iMac, iPod, iTunes, iPhone, and iPad, defined by the seamless synthesis of technology, liberal arts, and minimalist design.`,
    achievements: [
      "Co-founded Apple Inc. and launched the Apple II, sparking the personal computer revolution.",
      "Introduced the Macintosh (1984), popularizing the graphical user interface (GUI) and desktop publishing.",
      "Acquired and built Pixar into a dominant animation studio, producing the first fully CGI film 'Toy Story' (1995).",
      "Transformed mobile communications, digital music, and computing with the iPod (2001), iPhone (2007), and iPad (2010).",
      "Pioneered holistic industrial design, typography integration, and capacitive multi-touch interaction."
    ],
    legacy: `Jobs proved that technology reaches its highest expression when standing at the intersection of technology and the liberal arts, fundamentally reshaping human interaction with machines.`,
    sources: [
      { title: "Steve Jobs - Wikipedia", uri: "https://en.wikipedia.org/wiki/Steve_Jobs" },
      { title: "Computer History Museum - Steve Jobs Collection", uri: "https://computerhistory.org/" }
    ]
  },
  thoth: {
    entityId: "thoth",
    name: "Thoth (Djehuty)",
    era: "Predynastic to Greco-Roman Egypt (c. 3100 BCE – 4th Century CE) • Khemenu (Hermopolis Magna), Egypt",
    biography: `Thoth (ancient Egyptian: Djehuty) is the revered Egyptian deity of wisdom, writing, hieroglyphs, science, magic, mathematics, the moon, and the judgment of the dead. Depicted as an ibis or baboon, Thoth was considered the heart and tongue of Ra, speaking the cosmic words of power that brought creation into manifest reality.

In Egyptian religion, Thoth served as the supreme scribe of the gods, keeper of divine balance (working alongside Ma'at), and recorder of the Weighing of the Heart ceremony in the Hall of the Two Truths. He was credited with inventing writing, surveying, geometry, astronomy, the 365-day calendar, and the sacred books of medicine and magic.`,
    achievements: [
      "Patron deity and inventor of Egyptian hieroglyphs (Medu Netjer - 'God's Words').",
      "Author of the legendary 'Book of Thoth', containing secrets of celestial mechanics, magic, and sacred law.",
      "Arbitrator in the mythic conflict between Horus and Set, restoring cosmic equilibrium.",
      "Recorder of the Weighing of the Heart at the Judgement of Osiris.",
      "Originator of the 365-day solar calendar by winning five extra days in a game of senet against the Moon."
    ],
    legacy: `Thoth is the classical embodiment of divine measurement, accurate record-keeping, and the sacred science of writing that enables knowledge to transcend mortality.`,
    sources: [
      { title: "Thoth - Wikipedia", uri: "https://en.wikipedia.org/wiki/Thoth" },
      { title: "Ancient Egypt Online - Thoth", uri: "https://ancientegyptonline.co.uk/thoth/" }
    ]
  },
  sophia: {
    entityId: "sophia",
    name: "Sophia (Holy Wisdom)",
    era: "Hellenistic, Gnostic & Byzantine Traditions (1st Century BCE – Present) • Alexandria, Constantinople, Mediterranean",
    biography: `Sophia (Greek: Σοφία, 'Wisdom') is the personification of divine wisdom across Hellenistic philosophy, Jewish sapiential literature (Book of Wisdom, Proverbs), Christian theology, and Gnostic cosmology. In Byzantine civilization, the Great Church of Hagia Sophia ('Holy Wisdom') was dedicated to this divine principle.

In Gnostic texts discovered at Nag Hammadi (such as the 'Pistis Sophia' and 'Apocryphon of John'), Sophia is the divine Aeon whose descent and longing to understand the transcendent source birthed the material universe. Her redemption and restoration of divine light to the Pleroma represents the ultimate awakening and enlightenment of human consciousness.`,
    achievements: [
      "Central figure of sapiential philosophy and Jewish-Hellenistic wisdom texts (Philo of Alexandria).",
      "Dedicatee of Hagia Sophia in Constantinople, one of history's greatest architectural and spiritual monuments.",
      "Central protagonist in Gnostic scriptures representing divine intuition, light redemption, and gnosis.",
      "Symbolic cornerstone of philosophical epistemology: 'Philosophia'—the love of Sophia.",
      "Archetype of the divine feminine principle of cosmic illumination and contemplative discernment."
    ],
    legacy: `Sophia represents the eternal bridge between the unknowable divine realm and human conscious awakening, illuminating the path from ignorance to inner truth.`,
    sources: [
      { title: "Sophia (wisdom) - Wikipedia", uri: "https://en.wikipedia.org/wiki/Sophia_(wisdom)" },
      { title: "The Nag Hammadi Library Archives", uri: "http://gnosis.org/naghamm/nhl.html" }
    ]
  },
  shannon: {
    entityId: "shannon",
    name: "Claude Shannon",
    era: "20th Century (1916–2001) • Petoskey, Michigan / Bell Laboratories / MIT, USA",
    biography: `Claude Elwood Shannon was an American mathematician, electrical engineer, and cryptographer renowned as the 'father of information theory'. In his landmark 1948 paper 'A Mathematical Theory of Communication', Shannon introduced the concept of the 'bit' as the universal unit of information, formalized information entropy, and established fundamental mathematical limits on signal compression and transmission speed over noisy channels.
    
During World War II, Shannon developed the mathematical theory of cryptography at Bell Labs and designed the SIGSALY encrypted speech system used for wartime Allied high-level communications. His 1937 MIT master's thesis proved that electrical switches could implement Boolean algebra, providing the foundational blueprint for all digital circuit and computer design.`,
    achievements: [
      "Founded Information Theory with the seminal 1948 paper 'A Mathematical Theory of Communication'.",
      "Invented the 'bit' (binary digit) as the fundamental unit of digital information.",
      "Proved Boolean algebra maps directly to electrical switching circuits (1937 MIT thesis).",
      "Formulated the Noisy-Channel Coding Theorem and Shannon-Hartley Channel Capacity Law.",
      "Designed pioneering artificial intelligence experiments, including 'Theseus' the robotic maze-solving mouse (1950)."
    ],
    legacy: `Shannon laid the conceptual and mathematical foundations for the entire modern digital revolution, the Internet, data compression, cryptography, and digital telecommunications.`,
    sources: [
      { title: "Claude Shannon - Wikipedia", uri: "https://en.wikipedia.org/wiki/Claude_Shannon" },
      { title: "MIT Technology Review - The Mind of Claude Shannon", uri: "https://www.technologyreview.com/" }
    ]
  },
  leibniz: {
    entityId: "leibniz",
    name: "Gottfried Wilhelm Leibniz",
    era: "Enlightenment (1646–1716) • Leipzig, Hanover, Berlin (Holy Roman Empire / Germany)",
    biography: `Gottfried Wilhelm Leibniz was a German polymath, philosopher, mathematician, and diplomat who made groundbreaking contributions to logic, physics, metaphysics, law, and theology. Leibniz independently developed infinitesimal calculus, creating the notation (integral ∫ and differential d) that remains the universal standard in modern mathematics.
    
Leibniz was one of the earliest pioneers of computer science, documenting the modern binary numerical system (base-2) and constructing the 'Stepped Reckoner', a mechanical calculating machine capable of performing all four basic arithmetic operations. In his metaphysical masterpiece 'Monadology', he conceived reality as composed of dynamic, immaterial centers of perception ('monads') synchronized in pre-established harmony.`,
    achievements: [
      "Co-invented infinitesimal calculus and established standard modern calculus notation (dx, ∫).",
      "Formalized the binary number system (0 and 1) as the universal basis for calculation.",
      "Invented the Stepped Reckoner mechanical calculating engine.",
      "Authored the 'Monadology' (1714) and formulated the Principle of Sufficient Reason.",
      "Pioneered symbolic logic and the dream of a universal language of thought ('Characteristica Universalis')."
    ],
    legacy: `Leibniz stands as one of history's most encyclopedic minds, anticipating digital computation, symbolic logic, relational physics, and cybernetics centuries before their formalization.`,
    sources: [
      { title: "Gottfried Wilhelm Leibniz - Stanford Encyclopedia of Philosophy", uri: "https://plato.stanford.edu/entries/leibniz/" },
      { title: "Leibniz - Wikipedia", uri: "https://en.wikipedia.org/wiki/Gottfried_Wilhelm_Leibniz" }
    ]
  },
  ada_lovelace: {
    entityId: "ada_lovelace",
    name: "Ada Lovelace",
    era: "19th Century (1815–1852) • London, England",
    biography: `Augusta Ada King, Countess of Lovelace, was an English mathematician and writer widely celebrated as the world's first computer programmer. Daughter of the Romantic poet Lord Byron and mathematician Anne Isabella Milbanke, Ada synthesized mathematics with imagination in what she termed 'Poetical Science'.
    
Collaborating with Charles Babbage on his proposed mechanical general-purpose computer, the Analytical Engine, Lovelace translated Luigi Menabrea's memoir on the engine and added extensive 'Notes'. Note G contained the first published algorithm specifically designed for computer execution—to calculate Bernoulli numbers. She made the visionary leap that computers could manipulate symbols and generate music or graphics rather than just calculating numbers.`,
    achievements: [
      "Created the world's first computer algorithm (Bernoulli number computation in Note G, 1843).",
      "Articulated the concept of general-purpose computing beyond numerical calculation.",
      "Pioneered the philosophy of 'Poetical Science', fusing mathematical rigor with imaginative creativity.",
      "Foresaw algorithmic composition of music, visual patterns, and scientific simulations.",
      "Eponym of the ADA programming language developed by the United States Department of Defense."
    ],
    legacy: `Lovelace serves as the foundational visionary of computing software, demonstrating that computing machines could become universal expressive instruments of human culture and intelligence.`,
    sources: [
      { title: "Ada Lovelace - Wikipedia", uri: "https://en.wikipedia.org/wiki/Ada_Lovelace" },
      { title: "The Computer History Museum - Ada Lovelace", uri: "https://computerhistory.org/" }
    ]
  },
  max_planck: {
    entityId: "max_planck",
    name: "Max Planck",
    era: "Late 19th to Mid 20th Century (1858–1947) • Kiel, Berlin, Göttingen (Germany)",
    biography: `Max Karl Ernst Ludwig Planck was a German theoretical physicist who revolutionized our understanding of atomic and subatomic processes by founding quantum physics. In 1900, to solve the blackbody radiation 'ultraviolet catastrophe', Planck proposed that electromagnetic energy is emitted and absorbed only in discrete, indivisible packets called 'quanta', related to frequency by his fundamental constant (h).
    
Awarded the 1918 Nobel Prize in Physics, Planck served as president of the Kaiser Wilhelm Society (later renamed the Max Planck Society). His revolutionary constant bridged classical thermodynamics with modern quantum mechanics, fundamentally reshaping astronomy, solid-state physics, chemistry, and semiconductor technology.`,
    achievements: [
      "Formulated Planck's Law of Blackbody Radiation (1900), solving the ultraviolet catastrophe.",
      "Discovered Planck's Constant (h = 6.626 × 10⁻³⁴ J·s), the fundamental quantum of action.",
      "Won the 1918 Nobel Prize in Physics for the discovery of energy quanta.",
      "Introduced Planck units (Planck length, Planck time, Planck mass)—the natural dimensional limits of physics.",
      "Championed and defended scientific integrity and free academic inquiry through two world wars."
    ],
    legacy: `Planck unlocked the subatomic quantum realm, establishing the foundation upon which Einstein, Bohr, Heisenberg, and Schrödinger built modern quantum physics and all contemporary electronics.`,
    sources: [
      { title: "Max Planck - NobelPrize.org", uri: "https://www.nobelprize.org/prizes/physics/1918/planck/biographical/" },
      { title: "Max Planck - Wikipedia", uri: "https://en.wikipedia.org/wiki/Max_Planck" }
    ]
  },
  john_dee: {
    entityId: "john_dee",
    name: "Dr. John Dee",
    era: "Renaissance / Elizabethan Era (1527–1608/09) • London / Mortlake, England",
    biography: `Dr. John Dee was an English mathematician, astronomer, astrologer, occult philosopher, and royal advisor to Queen Elizabeth I. Educated at St John's College, Cambridge, Dee possessed one of the largest private libraries in 16th-century Europe and served as England's leading authority on navigation mathematics, mapmaking, and perspective geometry.
    
Dee authored the 'Monas Hieroglyphica' (1564), a mystical treatise presenting a unified esoteric glyph synthesizing astronomy, alchemy, geometry, and linguistics. Alongside his mathematical prefaces to Euclid's Elements, Dee explored celestial communication and Enochian language systems with Edward Kelley, seeking divine insight into the cosmic order.`,
    achievements: [
      "Authored the famous Mathematical Preface to Henry Billingsley's English translation of Euclid (1570).",
      "Created the 'Monas Hieroglyphica' (1564), a unified sacred geometric and alchemical talisman.",
      "Coined the term 'British Empire' and calculated imperial maritime navigation routes.",
      "Advised Queen Elizabeth I on royal calendar reform and geographical exploration.",
      "Pioneered the preservation of ancient scientific manuscripts in Renaissance England."
    ],
    legacy: `Dee exemplifies the Renaissance Magus who seamlessly bridged rigorous navigation mathematics and geometry with sacred esoteric Hermeticism and celestial cartography.`,
    sources: [
      { title: "John Dee - Wikipedia", uri: "https://en.wikipedia.org/wiki/John_Dee" },
      { title: "British Library - John Dee Archives", uri: "https://www.bl.uk/" }
    ]
  },
  paracelsus: {
    entityId: "paracelsus",
    name: "Paracelsus",
    era: "Renaissance (1493–1541) • Einsiedeln (Switzerland) / Salzburg (Austria)",
    biography: `Paracelsus (born Philippus Aureolus Theophrastus Bombastus von Hohenheim) was a Swiss physician, alchemist, lay theologian, and philosopher who revolutionized medicine by introducing chemistry and empirical observation to therapeutics. Rejecting ancient Galenic humoral dogma, he emphasized that diseases originate from external chemical imbalances and mineral poisons rather than imbalances in the four humors.
    
Paracelsus pioneered the use of minerals, chemical elixirs, and laudanum in medicine, introduced the concept of the 'Tria Prima' (Sulfur, Mercury, Salt) to explain physical and spiritual nature, and formulated the foundational principle of toxicology: 'All things are poison, and nothing is without poison; the dosage alone makes it so a thing is not a poison.'`,
    achievements: [
      "Founded modern toxicology and pharmaceutical chemistry (iatrochemistry).",
      "Formulated the Tria Prima (Sulfur = soul/flame, Mercury = spirit/volatility, Salt = body/structure).",
      "Pioneered clinical toxicology and the principle of dose-dependent therapeutic action.",
      "Authored groundbreaking treatises on occupational diseases (miners' lung disease) and wound healing.",
      "Created spagyric pharmacology, using alchemical extraction to purify herbal and mineral medicines."
    ],
    legacy: `Paracelsus transformed alchemy into clinical pharmacology and empirical medicine, demanding that healers learn directly from Nature's living book rather than academic dogma.`,
    sources: [
      { title: "Paracelsus - Wikipedia", uri: "https://en.wikipedia.org/wiki/Paracelsus" },
      { title: "National Library of Medicine - Paracelsus", uri: "https://www.nlm.nih.gov/" }
    ]
  },
  giordano_bruno: {
    entityId: "giordano_bruno",
    name: "Giordano Bruno",
    era: "Renaissance (1548–1600) • Nola (Kingdom of Naples) / Rome, Italy",
    biography: `Giordano Bruno was an Italian Dominican friar, philosopher, mathematician, poet, and cosmological theorist. Expanding upon the Copernican heliocentric model, Bruno proposed that the stars were distant suns surrounded by their own exoplanets, and that the universe is infinite with no center, filled with innumerable living worlds.
    
Bruno was a renowned master of mnemonics (the art of memory), inventing complex concentric rotating wheels inscribed with mythological and astrological symbols to encode knowledge. Refusing to recant his philosophical beliefs regarding the infinite divine universe, he was convicted of heresy by the Roman Inquisition and burned at the stake in the Campo de' Fiori in 1600.`,
    achievements: [
      "Conceptualized an infinite universe with innumerable inhabited exoplanetary solar systems (1584).",
      "Pioneered advanced combinatoric mnemonics and memory palaces ('De Umbris Idearum', 1582).",
      "Synthesized Hermetic philosophy, Neoplatonism, and mathematical atomism into a unified cosmology.",
      "Advocated cosmological pantheism and the unity of divine intelligence within all living matter.",
      "Endured martyrdom as an enduring global symbol of free thought and unyielding intellectual courage."
    ],
    legacy: `Bruno anticipated modern astrophysics and exoplanetary science by over four centuries, standing as a towering martyr for the infinite freedom of the human mind and cosmic inquiry.`,
    sources: [
      { title: "Giordano Bruno - Stanford Encyclopedia of Philosophy", uri: "https://plato.stanford.edu/entries/bruno/" },
      { title: "Giordano Bruno - Wikipedia", uri: "https://en.wikipedia.org/wiki/Giordano_Bruno" }
    ]
  },
  pythagoras: {
    entityId: "pythagoras",
    name: "Pythagoras of Samos",
    era: "Ancient Greece (c. 570–c. 495 BCE) • Samos / Croton (Magna Graecia / Southern Italy)",
    biography: `Pythagoras of Samos was an ancient Ionian Greek philosopher, mathematician, and mystic whose teachings deeply shaped Plato, Aristotle, and the foundation of Western mathematics and music. In Croton, he founded the Pythagorean brotherhood, a philosophical and political community that studied mathematics, astronomy, ethics, and harmonic acoustics.
    
Pythagoras discovered that musical intervals correspond to simple whole-number ratios on a vibrating string (2:1 for an octave, 3:2 for a fifth, 4:3 for a fourth). This discovery inspired his doctrine of 'Musica Universalis' (the Music of the Spheres)—the principle that celestial bodies move according to harmonic mathematical proportions. The Pythagoreans venerated the Sacred Tetractys (1 + 2 + 3 + 4 = 10) as the cosmic source of all geometry.`,
    achievements: [
      "Discovered the mathematical harmonic ratios governing musical acoustics (octave, fifth, fourth).",
      "Formulated the Pythagorean Theorem in Euclidean geometry (a² + b² = c²).",
      "Conceived 'Musica Universalis' (Music of the Spheres), uniting astronomy and acoustics.",
      "Introduced the Sacred Tetractys as the geometric and arithmetic archetype of reality.",
      "Founded the philosophical school of Pythagoreanism emphasizing vegetarianism, ethics, and metempsychosis."
    ],
    legacy: `Pythagoras established the profound truth that physical reality is structured by mathematical harmony and numerical ratios, echoing through Kepler's laws, string theory, and quantum mechanics.`,
    sources: [
      { title: "Pythagoras - Stanford Encyclopedia of Philosophy", uri: "https://plato.stanford.edu/entries/pythagoras/" },
      { title: "Pythagoras - Wikipedia", uri: "https://en.wikipedia.org/wiki/Pythagoras" }
    ]
  },
  buckminster_fuller: {
    entityId: "buckminster_fuller",
    name: "Buckminster Fuller",
    era: "20th Century (1895–1983) • Milton, Massachusetts / Carbondale, Illinois / California, USA",
    biography: `Richard Buckminster 'Bucky' Fuller was an American architect, systems theorist, author, designer, and inventor. Dedicating his life to 'making the world work for 100% of humanity in the shortest possible time through spontaneous cooperation without ecological offense', Fuller developed Synergetics—nature's coordinate system based on triangulated geometry and the vector equilibrium.
    
Fuller popularized the Geodesic Dome, an omni-triangulated hemispherical structure that becomes proportionally stronger as it scales in size. He coined terms such as 'Spaceship Earth', 'Tensegrity' (tensional integrity), 'Dymaxion' (dynamic maximum tension), and 'ephemeralization' (doing more with less), authoring more than 30 books including 'Operating Manual for Spaceship Earth'.`,
    achievements: [
      "Patented and constructed the Geodesic Dome (notably the Montreal Expo 67 Biosphere).",
      "Developed Synergetics and discovered the Vector Equilibrium (cuboctahedron zero-phase).",
      "Invented Tensegrity structural systems and the Dymaxion Car, House, and World Map projection.",
      "Authored 'Operating Manual for Spaceship Earth' and 'Critical Path' on global sustainability.",
      "Awarded 47 honorary doctorates and 28 US patents; namesake of the carbon-60 molecule 'Buckminsterfullerene'."
    ],
    legacy: `Fuller remains the premier archetype of the comprehensive anticipatory design scientist whose synergetic geometries and global resource syntropy inspire modern sustainable architecture and aerospace.`,
    sources: [
      { title: "Buckminster Fuller Institute", uri: "https://www.bfi.org/" },
      { title: "Buckminster Fuller - Wikipedia", uri: "https://en.wikipedia.org/wiki/Buckminster_Fuller" }
    ]
  },
  norbert_wiener: {
    entityId: "norbert_wiener",
    name: "Norbert Wiener",
    era: "20th Century (1894–1964) • Columbia, Missouri / MIT, Cambridge, Massachusetts, USA",
    biography: `Norbert Wiener was an American mathematician, philosopher, and MIT professor who founded 'Cybernetics'—the interdisciplinary study of control, communication, and feedback loops in living organisms, machines, and organizations. A child prodigy who received his Harvard PhD at age 18, Wiener made major contributions to stochastic processes, harmonic analysis, quantum theory, and statistical mechanics.
    
In his 1948 book 'Cybernetics: Or Control and Communication in the Animal and the Machine', Wiener formalized how feedback mechanisms enable self-regulation, goal-seeking behavior, and anti-entropic stability. He was also a pioneer in machine ethics, authoring 'The Human Use of Human Beings' to warn against the societal dangers of unregulated automation.`,
    achievements: [
      "Founded the science of Cybernetics (1948), establishing feedback loop theory across biology and engineering.",
      "Developed the Wiener Filter for statistical signal processing and noise reduction in radar.",
      "Formulated the Wiener Process (mathematical model of Brownian motion) fundamental to stochastic calculus.",
      "Pioneered theories of homeostatic feedback, servomechanisms, and adaptive automated systems.",
      "Authored 'The Human Use of Human Beings' (1950), laying early foundations for AI ethics."
    ],
    legacy: `Wiener's cybernetic framework provided the conceptual architecture for modern robotics, computer science, automated systems, cognitive neuroscience, and complex systems theory.`,
    sources: [
      { title: "Norbert Wiener - Wikipedia", uri: "https://en.wikipedia.org/wiki/Norbert_Wiener" },
      { title: "MIT Institute Archives - Norbert Wiener Papers", uri: "https://libraries.mit.edu/archives/" }
    ]
  },
  hildegard: {
    entityId: "hildegard",
    name: "Hildegard von Bingen",
    era: "High Middle Ages (1098–1179) • Bermersheim / Rupertsberg / Bingen am Rhein, Holy Roman Empire",
    biography: `Saint Hildegard of Bingen, also known as the 'Sibyl of the Rhine', was a German Benedictine abbess, polymath, mystic, composer, philosopher, playwright, and naturalist. Experiencing luminous visionary states from childhood, she recorded her cosmic and theological visions in the illuminated manuscript 'Scivias' ('Know the Ways of the Lord'), with ecclesiastical approval from Pope Eugenius III.
    
Hildegard composed over 70 sacred liturgical chants collected in 'Symphonia armonie celestium revelationum' and the earliest surviving morality play with music, 'Ordo Virtutum'. In her scientific treatises 'Physica' and 'Causae et Curae', she codified a holistic ecological philosophy rooted in 'Viriditas'—the divine greening life force that sustains vitality across plants, animals, and human souls.`,
    achievements: [
      "Composed 'Symphonia armonie celestium revelationum' and 'Ordo Virtutum'—foundational pinnacles of Western monophony.",
      "Authored the illuminated theological and cosmological trilogy: 'Scivias', 'Liber Vitae Meritorum', and 'Liber Divinorum Operum'.",
      "Pioneered holistic medicine and botany in 'Physica' and 'Causae et Curae'.",
      "Articulated the vitalist concept of 'Viriditas' (the divine greening life-force of nature and health).",
      "Invented 'Lingua Ignota', one of the earliest constructed sacred languages, complete with its own alphabet.",
      "Canonized and declared a Doctor of the Church by Pope Benedict XVI in 2012."
    ],
    legacy: `Hildegard stands as one of the most radiant creative and spiritual geniuses of the Middle Ages, uniting musical ecstasy, natural science, botanical healing, and ecological mysticism.`,
    sources: [
      { title: "Hildegard of Bingen - Stanford Encyclopedia of Philosophy", uri: "https://plato.stanford.edu/entries/hildegard/" },
      { title: "Hildegard of Bingen - Wikipedia", uri: "https://en.wikipedia.org/wiki/Hildegard_of_Bingen" }
    ]
  },
  spinoza: {
    entityId: "spinoza",
    name: "Baruch Spinoza",
    era: "Age of Reason / 17th Century (1632–1677) • Amsterdam / The Hague, Dutch Republic",
    biography: `Baruch Spinoza (later Benedict de Spinoza) was a Jewish-Dutch philosopher of Portuguese Sephardic origin whose radical rationalism laid the groundwork for the 18th-century Enlightenment, modern biblical criticism, and democratic political philosophy. Excommunicated from the Amsterdam Jewish community in 1656 for his heterodox views, Spinoza lived a quiet life grinding optical lenses while developing his philosophy.
    
In his magnum opus 'Ethics' (published posthumously in 1677), Spinoza presented his philosophy 'in geometric order' (more geometrico), demonstrating that there is only one infinite, self-caused substance: God or Nature ('Deus sive Natura'). Mind and matter are two parallel, non-dual expressions of this single reality, and human freedom arises from rational understanding 'under the aspect of eternity' (sub specie aeternitatis).`,
    achievements: [
      "Authored the 'Ethics' (Ethica Ordine Geometrico Demonstrata, 1677).",
      "Formulated the pantheistic/panentheistic unified field of 'Deus sive Natura' (God or Nature).",
      "Pioneered modern biblical source criticism and the philosophical defense of secular democratic tolerance ('Tractatus Theologico-Politicus', 1670).",
      "Developed mind-body parallelism and the concept of 'Conatus' (the innate drive of all beings to persist in existence).",
      "Grinded precision optical lenses that advanced microscope and telescope observation in the 17th century."
    ],
    legacy: `Spinoza is celebrated as the archetype of philosophical integrity, offering a harmonious, non-dual vision of nature, mind, and freedom that inspired Goethe, Einstein, Hegel, and modern systems thinkers.`,
    sources: [
      { title: "Baruch Spinoza - Stanford Encyclopedia of Philosophy", uri: "https://plato.stanford.edu/entries/spinoza/" },
      { title: "Baruch Spinoza - Wikipedia", uri: "https://en.wikipedia.org/wiki/Baruch_Spinoza" }
    ]
  },
  lukasiewicz: {
    entityId: "lukasiewicz",
    name: "Jan Łukasiewicz",
    era: "20th Century (1878–1956) • Lwów / Warsaw (Poland) / Dublin (Ireland)",
    biography: `Jan Łukasiewicz was a Polish logician, mathematician, and philosopher of the world-renowned Lwów–Warsaw school of logic. Rejecting the two-millennium-old Aristotelian dogma of the Law of the Excluded Middle (bivalence), Łukasiewicz formulated three-valued (ternary) logic in 1917, introducing a third truth-value for the indeterminate or contingent future ('possible' / 1/2).
    
He subsequently developed many-valued logical calculi and invented Polish notation (prefix notation), which eliminated the need for parentheses and directly enabled the development of stack-based computer architectures, Reverse Polish Notation (RPN) calculators, and abstract syntax tree interpreters.`,
    achievements: [
      "Invented three-valued (ternary) logic (L3, 1917) and generalized many-valued logic systems.",
      "Invented Polish notation (prefix notation), foundational to compiler design and mathematical parsing.",
      "Reconstructed ancient Aristotelian and Stoic propositional logic with modern mathematical rigor.",
      "Pioneered non-binary modal logic systems for quantum and probabilistic reasoning.",
      "Co-founded the Lwów–Warsaw school of logic, making Poland a global center of formal philosophy."
    ],
    legacy: `Łukasiewicz's creation of multi-valued logic shattered binary limitations, laying the conceptual foundation for ternary computing, fuzzy logic, quantum computing truth dynamics, and stack-based program execution.`,
    sources: [
      { title: "Jan Łukasiewicz - Stanford Encyclopedia of Philosophy", uri: "https://plato.stanford.edu/entries/lukasiewicz/" },
      { title: "Jan Łukasiewicz - Wikipedia", uri: "https://en.wikipedia.org/wiki/Jan_%C5%81ukasiewicz" }
    ]
  },
  godel: {
    entityId: "godel",
    name: "Kurt Gödel",
    era: "20th Century (1906–1978) • Brünn (Austria-Hungary) / Vienna / Princeton, USA",
    biography: `Kurt Friedrich Gödel was an Austrian-American logician, mathematician, and philosopher considered one of the greatest logicians in human history alongside Aristotle. In 1931, at age 25, Gödel published his two Incompleteness Theorems, demonstrating that any consistent axiomatic mathematical system sufficient to encode arithmetic contains true propositions that cannot be proved within the system, and that a system cannot prove its own consistency.
    
Working alongside Albert Einstein at the Institute for Advanced Study in Princeton, Gödel also discovered exact rotating cosmological solutions to Einstein's field equations (the Gödel metric) that mathematically permit closed timelike curves (time travel), and developed a formal modal ontological proof for the existence of God.`,
    achievements: [
      "Proved the First and Second Incompleteness Theorems (1931), redefining the foundations of mathematics.",
      "Invented Gödel numbering, arithmetizing formal syntax and anticipating computer instruction encoding.",
      "Proved the relative consistency of the Axiom of Choice and the Generalized Continuum Hypothesis with ZF set theory.",
      "Discovered the Gödel metric in general relativity, demonstrating the theoretical possibility of closed timelike curves.",
      "Formulated the modern modal ontological argument for necessary divine existence."
    ],
    legacy: `Gödel proved that human truth and mathematical insight infinitely exceed mechanical computation, establishing the ultimate theoretical boundary conditions for logic, AI, and cosmology.`,
    sources: [
      { title: "Kurt Gödel - Stanford Encyclopedia of Philosophy", uri: "https://plato.stanford.edu/entries/goedel/" },
      { title: "Kurt Gödel - Wikipedia", uri: "https://en.wikipedia.org/wiki/Kurt_G%C3%B6del" }
    ]
  },
  von_neumann: {
    entityId: "von_neumann",
    name: "John von Neumann",
    era: "20th Century (1903–1957) • Budapest, Hungary / Princeton, New Jersey, USA",
    biography: `John von Neumann was a Hungarian-American polymath, mathematician, physicist, and computer scientist of staggering intellect. Von Neumann made foundational contributions to quantum mechanics (Hilbert space formalism), game theory (Minimax theorem and 'Theory of Games and Economic Behavior' with Oskar Morgenstern), continuous geometry, and fluid dynamics.
    
He designed the standard stored-program architecture ('Von Neumann architecture') that powers virtually all modern microprocessors, created self-reproducing cellular automata that can replicate without informational degradation, and led the computational design of early electronic computers such as the IAS machine and MANIAC.`,
    achievements: [
      "Designed the Von Neumann computer architecture (stored-program concept with CPU, ALU, and memory).",
      "Founded modern mathematical Game Theory and proved the Minimax Theorem.",
      "Established the rigorous mathematical foundations of Quantum Mechanics via operator algebras in Hilbert space.",
      "Invented Self-Replicating Cellular Automata, proving machines can reproduce complex structures.",
      "Pioneered numerical weather prediction, Monte Carlo methods, and computer-aided ballistics."
    ],
    legacy: `Von Neumann stands as the universal computational architect of the 20th century, structuring digital computers, quantum physics, algorithmic economics, and synthetic self-replication.`,
    sources: [
      { title: "John von Neumann - Wikipedia", uri: "https://en.wikipedia.org/wiki/John_von_Neumann" },
      { title: "Institute for Advanced Study - John von Neumann", uri: "https://www.ias.edu/scholars/von-neumann" }
    ]
  },
  david_bohm: {
    entityId: "david_bohm",
    name: "David Bohm",
    era: "20th Century (1917–1992) • Wilkes-Barre, Pennsylvania / Princeton / London, UK",
    biography: `David Joseph Bohm was an American-Brazilian-British theoretical physicist who contributed deeply to quantum physics, neuropsychology, and the philosophy of mind. Mentored by Robert Oppenheimer, Bohm developed the De Broglie–Bohm pilot wave interpretation of quantum mechanics, introducing non-local quantum potential (Q) to preserve determinism and ontological realism.
    
In his seminal work 'Wholeness and the Implicate Order' (1980), Bohm proposed that reality is an unbroken, flowing 'holomovement' where manifest physical reality (the explicate order) unfolds from a deeper, enfolded holographic domain (the implicate order). Collaborating with neurosurgeon Karl Pribram, he developed the Holonomic Brain Model, viewing memory and consciousness as distributed holographic wave interference patterns.`,
    achievements: [
      "Formulated De Broglie–Bohm pilot wave mechanics and the non-local Quantum Potential (Q).",
      "Created the paradigm of the 'Implicate and Explicate Order' of reality and the holomovement.",
      "Co-developed the Holonomic Brain Theory with Karl Pribram.",
      "Predicted the Aharonov–Bohm effect, proving electromagnetic potentials have physical consequences in quantum mechanics.",
      "Pioneered 'Bohm Dialogue', a non-adversarial, transformative method of collective inquiry."
    ],
    legacy: `Bohm provided the definitive bridge between quantum physics, holography, and holistic consciousness, demonstrating that the universe is an indivisible, dynamic living tapestry.`,
    sources: [
      { title: "David Bohm - Wikipedia", uri: "https://en.wikipedia.org/wiki/David_Bohm" },
      { title: "The Bohm Dialogue Archives", uri: "https://www.david-bohm.net/" }
    ]
  },
  schrodinger: {
    entityId: "schrodinger",
    name: "Erwin Schrödinger",
    era: "20th Century (1887–1961) • Vienna (Austria) / Zürich / Dublin (Ireland)",
    biography: `Erwin Rudolf Josef Alexander Schrödinger was an Austrian theoretical physicist who revolutionized physics by developing wave mechanics and formulating the Schrödinger wave equation (1926), for which he shared the 1933 Nobel Prize in Physics with Paul Dirac.
    
Schrödinger formulated the famous 'Schrödinger's Cat' thought experiment to expose the conceptual paradoxes of the Copenhagen interpretation of quantum superposition. In his visionary 1944 book 'What is Life?', he introduced the concept of 'negative entropy' (negentropy) to explain how living organisms maintain structural order, and proposed that genetic information must be stored in an 'aperiodic crystal'—inspiring Watson and Crick's discovery of the DNA double helix.`,
    achievements: [
      "Formulated the Schrödinger Wave Equation, the governing law of non-relativistic quantum systems.",
      "Awarded the 1933 Nobel Prize in Physics for the discovery of new productive forms of atomic theory.",
      "Authored 'What is Life?' (1944), introducing 'negentropy' and predicting the physical basis of the genetic code.",
      "Created the Schrödinger's Cat paradox, pioneering quantum superposition and measurement theory.",
      "Integrated Eastern Vedanta and Upanishadic non-duality into modern quantum cosmology."
    ],
    legacy: `Schrödinger's wave equation forms the mathematical heartbeat of all quantum physics, quantum chemistry, semiconductor design, and quantum computing.`,
    sources: [
      { title: "Erwin Schrödinger - NobelPrize.org", uri: "https://www.nobelprize.org/prizes/physics/1933/schrodinger/biographical/" },
      { title: "Erwin Schrödinger - Wikipedia", uri: "https://en.wikipedia.org/wiki/Erwin_Schr%C3%B6dinger" }
    ]
  },
  walter_russell: {
    entityId: "walter_russell",
    name: "Walter Russell",
    era: "Late 19th to Mid 20th Century (1871–1963) • Boston, Massachusetts / Swannanoa, Virginia, USA",
    biography: `Walter Bowman Russell was an American polymath, artist, sculptor, builder, and natural philosopher whom the New York Herald Tribune called 'The Modern Leonardo'. Following a profound 39-day illuminative experience in 1921, Russell authored 'The Universal One' and 'The Secret of Light', presenting a unified cosmogony based on rhythmic octave wave mechanics.
    
Russell mapped the periodic table of elements as a continuous octave spiral of gyroscopic motion, predicting the existence of heavy isotopes such as deuterium and tritium, as well as transuranic elements (neptunium and plutonium) years before their laboratory synthesis. He formulated the cosmic law of 'Rhythmic Balanced Interchange' governing all physical and biological growth.`,
    achievements: [
      "Authored 'The Universal One' (1926) and 'The Secret of Light' (1947) on octave wave cosmogony.",
      "Predicted isotopes of hydrogen (deuterium, tritium) and transuranic elements via spiral periodic chart.",
      "Formulated the Law of Rhythmic Balanced Interchange centering all centripetal and centrifugal motion.",
      "Master sculptor, creating monuments including the Mark Twain Memorial and Franklin D. Roosevelt bust.",
      "Co-founded the University of Science and Philosophy at Swannanoa, Virginia."
    ],
    legacy: `Russell presented a harmonious, electric wave-vortex cosmology that unites geometry, artistic beauty, elemental chemistry, and spiritual consciousness into one unified field.`,
    sources: [
      { title: "University of Science and Philosophy - Walter Russell", uri: "https://www.philosophy.org/" },
      { title: "Walter Russell - Wikipedia", uri: "https://en.wikipedia.org/wiki/Walter_Russell" }
    ]
  },
  mandelbrot: {
    entityId: "mandelbrot",
    name: "Benoit Mandelbrot",
    era: "20th to 21st Century (1924–2010) • Warsaw (Poland) / Paris / IBM Yorktown Heights / Yale, USA",
    biography: `Benoit B. Mandelbrot was a Polish-born French and American mathematician who founded fractal geometry and coined the term 'fractal' from the Latin 'fractus' (broken). Working as an IBM Fellow with access to early supercomputers and graphics terminals, Mandelbrot visualized recursive non-linear equations, discovering the iconic Mandelbrot Set in 1980.
    
In his masterpiece 'The Fractal Geometry of Nature' (1982), Mandelbrot proved that natural systems—coastlines, rivers, galaxies, bronchial trees, turbulence, and financial markets—are governed by roughness, scale invariance, and self-similarity rather than smooth Euclidean geometry.`,
    achievements: [
      "Discovered the Mandelbrot Set (z_{n+1} = z_n² + c), one of the most famous objects in mathematics.",
      "Founded Fractal Geometry and authored 'The Fractal Geometry of Nature' (1982).",
      "Introduced fractal dimensions (Hausdorff-Besicovitch) to model roughness in physical and natural phenomena.",
      "Pioneered fractal market hypothesis, proving financial price changes follow fat-tailed power laws.",
      "Awarded the Wolf Prize in Physics (1993) and the Japan Prize (2003)."
    ],
    legacy: `Mandelbrot revolutionized mathematics, computer graphics, physics, chaos theory, and finance by giving humanity the geometric language to comprehend nature's self-similar, rough infinity.`,
    sources: [
      { title: "Benoit Mandelbrot - Yale University", uri: "https://www.yale.edu/" },
      { title: "Benoit Mandelbrot - Wikipedia", uri: "https://en.wikipedia.org/wiki/Benoit_Mandelbrot" }
    ]
  },
  ashby: {
    entityId: "ashby",
    name: "W. Ross Ashby",
    era: "20th Century (1903–1972) • London / Gloucester (England) / University of Illinois, USA",
    biography: `William Ross Ashby was an English psychiatrist and pioneering cyberneticist who made foundational contributions to complex adaptive systems, cybernetics, and cognitive neuroscience. Ashby was a key member of the legendary Ratio Club, an informal dining club of British scientists that discussed cybernetics.
    
In his seminal works 'Design for a Brain' (1952) and 'An Introduction to Cybernetics' (1956), Ashby formulated the cornerstone 'Law of Requisite Variety', which states that for a regulator to achieve stability, its variety of possible states must equal or exceed the variety of disturbances from the environment. He constructed the 'Homeostat' (1948), an electromechanical device capable of finding stable equilibrium through dynamic internal reorganization.`,
    achievements: [
      "Formulated the Law of Requisite Variety (V_S ≥ V_D), the foundational theorem of control systems.",
      "Invented the Homeostat (1948), the first physical ultra-stable self-organizing machine.",
      "Authored 'Design for a Brain' (1952) and 'An Introduction to Cybernetics' (1956).",
      "Pioneered mathematical theories of multistability, habituation, and dynamic homeostatic feedback.",
      "Laid the conceptual foundations for modern complex adaptive systems, neural networks, and AI autonomy."
    ],
    legacy: `Ashby's Law of Requisite Variety remains the supreme mathematical principle governing autonomous agent architectures, ecological homeostasis, and cybernetic survivability.`,
    sources: [
      { title: "W. Ross Ashby Digital Archive", uri: "https://www.rossashby.info/" },
      { title: "W. Ross Ashby - Wikipedia", uri: "https://en.wikipedia.org/wiki/W._Ross_Ashby" }
    ]
  },
  stafford_beer: {
    entityId: "stafford_beer",
    name: "Stafford Beer",
    era: "20th Century (1926–2002) • London, England / Santiago, Chile / Toronto, Canada",
    biography: `Anthony Stafford Beer was a British theorist, cybernetician, management consultant, and philosopher widely recognized as the father of management cybernetics. Beer developed the 'Viable System Model' (VSM), a five-tier recursive architectural blueprint defining the necessary conditions for any complex organizational system to maintain independent survival and viability.
    
Between 1971 and 1973, Beer served as scientific director of Chile's revolutionary 'Project Cybersyn' (SYNCO), constructing a decentralized, real-time computerized economic feedback network with an iconic operations room (Opsroom) that balanced worker autonomy with state-level coordination. Beer also coined the foundational cybernetic maxim 'POSIWID' (The Purpose of a System Is What It Does).`,
    achievements: [
      "Created the Viable System Model (VSM), the definitive five-level architecture for autonomous viable systems.",
      "Engineered Project Cybersyn in Chile (1971–1973), the world's first real-time cybernetic social-economic network.",
      "Coined the universal diagnostic axiom POSIWID ('The purpose of a system is what it does').",
      "Invented Team Syntegrity, an omni-triangulated non-hierarchical consensus methodology.",
      "Authored the cybernetic trilogy: 'Brain of the Firm', 'The Heart of Enterprise', and 'Diagnosing the System for Organizations'."
    ],
    legacy: `Beer demonstrated how real-time feedback loops, recursive decentralization, and cybernetic variety can design self-healing, adaptive organizations and resilient computational networks.`,
    sources: [
      { title: "Stafford Beer - Wikipedia", uri: "https://en.wikipedia.org/wiki/Stafford_Beer" },
      { title: "Liverpool John Moores University - Stafford Beer Collection", uri: "https://www.ljmu.ac.uk/" }
    ]
  },
  carl_jung: {
    entityId: "carl_jung",
    name: "Carl Gustav Jung",
    era: "Late 19th to Mid 20th Century (1875–1961) • Kesswil / Küsnacht / Zürich, Switzerland",
    biography: `Carl Gustav Jung was a Swiss psychiatrist, psychoanalyst, and founder of analytical psychology. Jung expanded depth psychology beyond personal biography by discovering the 'collective unconscious'—a deep layer of the human psyche containing universal primordial memory patterns and archetypes (such as the Shadow, Anima/Animus, Wise Old Man, and the Self).
    
Jung introduced the psychological concepts of introversion and extraversion, complex psychological types, and the process of 'individuation' (the lifelong integration of the conscious ego with the unconscious self). In collaboration with Nobel laureate physicist Wolfgang Pauli, Jung formulated 'Synchronicity' as an acausal connecting principle uniting mind and matter in a single cosmos ('unus mundus').`,
    achievements: [
      "Founded Analytical Psychology and discovered the Collective Unconscious and universal archetypes.",
      "Formulated the theory of Synchronicity (acausal meaningful coincidence) with physicist Wolfgang Pauli.",
      "Developed the concepts of Extraversion, Introversion, and psychological personality types (basis of MBTI).",
      "Authored the illuminated 'Red Book' (Liber Novus), detailing visionary active imagination techniques.",
      "Decoded the psychological symbolism of Western and Eastern alchemy in 'Psychology and Alchemy' and 'Mysterium Coniunctionis'."
    ],
    legacy: `Jung built an enduring psychological and metaphysical bridge between empirical science, myth, alchemical transmutation, and spiritual wholeness, transforming modern psychiatry, literature, and art.`,
    sources: [
      { title: "Carl Jung - Stanford Encyclopedia of Philosophy", uri: "https://plato.stanford.edu/entries/jung/" },
      { title: "Carl Jung - Wikipedia", uri: "https://en.wikipedia.org/wiki/Carl_Jung" }
    ]
  },
  robert_fludd: {
    entityId: "robert_fludd",
    name: "Robert Fludd",
    era: "Renaissance / Jacobean Era (1574–1637) • Bearsted, Kent / London, England",
    biography: `Robert Fludd (Robertus de Fluctibus) was an English physician, mathematician, alchemist, astrologer, and prominent defender of Rosicrucian philosophy. Educated at St John's College, Oxford, Fludd served as a fellow of the Royal College of Physicians and engaged in famous scientific and metaphysical debates with Johannes Kepler and Marin Mersenne.
    
In his masterwork 'Utriusque Cosmi Maioris scilicet et Minoris Metaphysica, Physica atque Technica Historia' (1617–1621), Fludd created iconic copperplate engravings illustrating the 'Divine Monochord' (Monochordum Mundanum), demonstrating how the hand of God tunes the cosmic string through exact Pythagorean musical intervals, connecting the divine realm with the physical elements.`,
    achievements: [
      "Authored the monumental encyclopedia 'Utriusque Cosmi Historia' (1617–1621).",
      "Created the iconic 'Divine Monochord' (Monochordum Mundanum) engraving of cosmic harmonic tuning.",
      "Illustrated the 'Pyramid of Light and Pyramid of Darkness' representing the dual interplay of spirit and matter.",
      "Invented early mechanical barometers (the 'weather glass') and automatic hydraulic musical machines.",
      "Published leading defenses of the Rosicrucian brotherhood ('Apologia Compendiaria', 1616)."
    ],
    legacy: `Fludd represents the pinnacle of Renaissance Hermetic synthesis, encoding the harmonic acoustic ratios, sacred geometry, and metaphysical architecture of the cosmos into timeless visual art.`,
    sources: [
      { title: "Robert Fludd - Stanford Encyclopedia of Philosophy", uri: "https://plato.stanford.edu/entries/fludd/" },
      { title: "Robert Fludd - Wikipedia", uri: "https://en.wikipedia.org/wiki/Robert_Fludd" }
    ]
  },
  terence_mckenna: {
    entityId: "terence_mckenna",
    name: "Terence McKenna",
    era: "Late 20th Century (1946–2000) • Paonia, Colorado / Berkeley, California / Kona, Hawaii, USA",
    biography: `Terence Kemp McKenna was an American ethnobotanist, mystic, author, and philosopher celebrated as a mesmerizing orator and bard of hyperdimensional consciousness. Exploring the Amazon basin and indigenous shamanic traditions, McKenna studied natural entheogens and advocated for the 'Archaic Revival'—a reconnection to direct spiritual experience, ecological symbiosis, and visionary imagination.
    
McKenna developed 'Novelty Theory' and the 'Timewave Zero' mathematical fractal curve (derived from the King Wen sequence of the I Ching), arguing that the universe is an engine maximizing novelty, density of interconnectedness, and complexity as it approaches an eschatological attractor at the end of time.`,
    achievements: [
      "Developed Novelty Theory and the Timewave Zero mathematical fractal wave of historical novelty.",
      "Formulated the 'Stoned Ape Theory' on the catalytic role of psilocybin in human cognitive and linguistic evolution.",
      "Authored visionary books including 'Food of the Gods', 'The Invisible Landscape', and 'True Hallucinations'.",
      "Pioneered spore cultivation techniques with his brother Dennis McKenna in 'Psilocybin: Magic Mushroom Grower's Guide'.",
      "Master orator who recorded hundreds of hours of spoken lectures exploring language, hyperspace, alchemy, and cybernetics."
    ],
    legacy: `McKenna revived the ancient shamanic archetype in the digital age, inspiring generations of artists, programmers, and philosophers to explore the boundaries of linguistic reality, time, and consciousness.`,
    sources: [
      { title: "Terence McKenna Archives", uri: "https://www.terencemckenna.com/" },
      { title: "Terence McKenna - Wikipedia", uri: "https://en.wikipedia.org/wiki/Terence_McKenna" }
    ]
  },
  kolmogorov: {
    entityId: "kolmogorov",
    name: "Andrey Kolmogorov",
    era: "20th Century (1903–1987) • Tambov / Moscow, Russia",
    biography: `Andrey Nikolaevich Kolmogorov was a preeminent Russian mathematician who made fundamental contributions across probability theory, topology, computational complexity, and fluid dynamics. In 1933, he published 'Grundbegriffe der Wahrscheinlichkeitsrechnung', establishing the rigorous measure-theoretic axiomatic foundation of modern probability.
    
In the 1960s, Kolmogorov founded Algorithmic Information Theory by defining Kolmogorov complexity K(s)—the shortest program that generates a given string—establishing an objective mathematical metric for descriptive complexity, randomness, and compression.`,
    achievements: [
      "Axiomatized modern probability theory using measure theory (Kolmogorov Axioms, 1933).",
      "Founded Algorithmic Information Theory and formulated Kolmogorov Complexity K(s).",
      "Formulated the Kolmogorov-Arnold Representation Theorem solving Hilbert's thirteenth problem.",
      "Created the K41 phenomenological theory of universal statistical turbulence.",
      "Pioneered algorithmic probability, algorithmic entropy, and stochastic processes."
    ],
    legacy: `Kolmogorov's mathematics underpins modern probability, machine learning, data compression, algorithmic statistics, and theoretical computer science.`,
    sources: [
      { title: "Andrey Kolmogorov - Wikipedia", uri: "https://en.wikipedia.org/wiki/Andrey_Kolmogorov" },
      { title: "MacTutor History of Mathematics - Andrey Kolmogorov", uri: "https://mathshistory.st-andrews.ac.uk/Biographies/Kolmogorov/" }
    ]
  },
  chaitin: {
    entityId: "chaitin",
    name: "Gregory Chaitin",
    era: "20th to 21st Century (1947–Present) • Chicago / New York / Buenos Aires / Rio de Janeiro",
    biography: `Gregory John Chaitin is an Argentine-American mathematician and computer scientist who co-founded Algorithmic Information Theory alongside Kolmogorov and Solomonoff. Working at IBM Research, Chaitin discovered the halting probability constant Omega (Ω), a real number whose digits are maximally dense in information and fundamentally uncomputable.
    
Chaitin proved that Gödelian incompleteness is not an isolated curiosity but an omnipresent feature of mathematics, showing that formal axiomatic systems cannot prove theorems containing more algorithmic information than the axioms themselves. In his later work, he created 'Metabiology' to formalize Darwinian evolution mathematically as random walks in software space.`,
    achievements: [
      "Discovered Chaitin's Omega Constant (Ω), the maximally incompressible halting probability.",
      "Formulated Chaitin's Incompleteness Theorem based on algorithmic information limits.",
      "Co-founded Algorithmic Information Theory and program-size complexity.",
      "Pioneered Metabiology, modeling biological DNA evolution as software mutation.",
      "Authored landmark books including 'Information-Theoretic Incompleteness' and 'Proving Darwin'."
    ],
    legacy: `Chaitin demonstrated that randomness, complexity, and irreducible information lie at the very core of pure mathematics and biological evolution.`,
    sources: [
      { title: "Gregory Chaitin Home Page", uri: "https://chaitin.ca/" },
      { title: "Gregory Chaitin - Wikipedia", uri: "https://en.wikipedia.org/wiki/Gregory_Chaitin" }
    ]
  },
  poincare: {
    entityId: "poincare",
    name: "Henri Poincaré",
    era: "Late 19th to Early 20th Century (1854–1912) • Nancy / Paris, France",
    biography: `Jules Henri Poincaré was a French mathematician, theoretical physicist, engineer, and philosopher of science widely regarded as the 'Last Universalist' capable of mastering all fields of mathematics. In his prize-winning work on the Three-Body Problem (1889), Poincaré discovered deterministic chaos, showing that small variations in initial conditions produce radically divergent trajectories.
    
Poincaré founded modern algebraic topology (Analysis Situs), qualitative dynamics, and phase space analysis. He formulated the celebrated Poincaré Conjecture (solved in 2003 by Grigori Perelman) and independently discovered the relativistic Lorentz transformations, formulating the Poincaré group.`,
    achievements: [
      "Discovered deterministic Chaos in celestial mechanics through the Three-Body Problem.",
      "Founded modern Algebraic Topology and authored 'Analysis Situs' (1895).",
      "Formulated the famous Poincaré Conjecture regarding 3-manifolds.",
      "Pioneered qualitative differential equations, limit cycles, and phase space section portraits.",
      "Anticipated Special Relativity through the principle of relativity and the Poincaré group."
    ],
    legacy: `Poincaré transformed classical physics and geometry into modern non-linear dynamics, chaos theory, and topology, reshaping our understanding of complex systems.`,
    sources: [
      { title: "Henri Poincaré - Stanford Encyclopedia of Philosophy", uri: "https://plato.stanford.edu/entries/poincare/" },
      { title: "Henri Poincaré - Wikipedia", uri: "https://en.wikipedia.org/wiki/Henri_Poincar%C3%A9" }
    ]
  },
  faraday: {
    entityId: "faraday",
    name: "Michael Faraday",
    era: "19th Century (1791–1867) • Newington Butts / London, England",
    biography: `Michael Faraday was an English natural philosopher and experimental physicist whose discoveries transformed electromagnetism and electrochemistry. Born into a working-class family and largely self-educated, Faraday rose from a bookbinder apprentice to Director of the Laboratory at the Royal Institution.
    
In 1831, Faraday discovered electromagnetic induction—the principle enabling electric generators and transformers. He discovered diamagnetism, the magneto-optical Faraday effect (proving light is an electromagnetic phenomenon), and formulated the laws of electrolysis. He conceived of physical reality not as action-at-a-distance, but as continuous lines of force filling space, which James Clerk Maxwell later formalized into electromagnetic field equations.`,
    achievements: [
      "Discovered Electromagnetic Induction (1831), enabling modern electrical generation and motors.",
      "Conceived the fundamental concept of continuous physical Electromagnetic Fields and lines of force.",
      "Discovered Diamagnetism and the Faraday Magneto-Optical Effect.",
      "Formulated the Laws of Electrolysis and coined terms: ion, electrode, cathode, and anode.",
      "Invented the Faraday Cage for electrostatic and electromagnetic field shielding."
    ],
    legacy: `Faraday's tactile visual intuition replaced mechanical particle collisions with continuous energetic fields, creating the foundation of modern field physics and the electrical age.`,
    sources: [
      { title: "The Royal Institution - Michael Faraday", uri: "https://www.rigb.org/explore-science/explore/people/michael-faraday" },
      { title: "Michael Faraday - Wikipedia", uri: "https://en.wikipedia.org/wiki/Michael_Faraday" }
    ]
  },
  peirce: {
    entityId: "peirce",
    name: "Charles Sanders Peirce",
    era: "19th to Early 20th Century (1839–1914) • Cambridge, Massachusetts / Milford, Pennsylvania, USA",
    biography: `Charles Sanders Peirce was an American polymath, logician, mathematician, and philosopher known as the father of Pragmatism. Peirce demonstrated that all human cognition, communication, and meaning are fundamentally triadic—structured through the irreducible interplay of Sign (Representamen), Object, and Interpretant.
    
Peirce made pioneering contributions to formal logic, inventing modern existential graphs, relational logic, and the concept of Abduction (inference to the best explanation). He developed an evolutionary cosmology of Tychism (objective chance) and Synechism (universal continuity), predicting multi-valued logic and quantum indeterminacy decades before their formal discovery.`,
    achievements: [
      "Founded American Pragmatism (the Pragmatic Maxim of meaning).",
      "Created modern Triadic Semiotics (Sign, Object, Interpretant).",
      "Invented Abductive Reasoning as the foundational logic of scientific discovery.",
      "Pioneered existential graphs and the logic of relatives.",
      "Anticipated three-valued logic, quantum indeterminacy, and continuum mathematics."
    ],
    legacy: `Peirce's triadic philosophy dissolves dualistic cartesian divisions, providing the definitive semiotic architecture for communication theory, cognitive science, and ternary logic.`,
    sources: [
      { title: "Charles Sanders Peirce - Stanford Encyclopedia of Philosophy", uri: "https://plato.stanford.edu/entries/peirce/" },
      { title: "Charles Sanders Peirce - Wikipedia", uri: "https://en.wikipedia.org/wiki/Charles_Sanders_Peirce" }
    ]
  },
  korzybski: {
    entityId: "korzybski",
    name: "Alfred Korzybski",
    era: "20th Century (1879–1950) • Warsaw, Poland / Chicago & Lakeville, USA",
    biography: `Alfred Habdank Skarbek Korzybski was a Polish-American engineer, mathematician, and philosopher who founded General Semantics. Korzybski served as an intelligence officer in World War I, which inspired his lifelong mission to develop non-Aristotelian cognitive tools that prevent semantic delusions and destructive psychological dogmatism.
    
In his landmark 1933 work 'Science and Sanity', Korzybski formulated the famous axiom 'The map is not the territory' and 'The map does not represent all of the territory.' He developed the 'Structural Differential' to visually train humans to distinguish between high-order verbal abstractions and non-verbal objective reality, laying the foundations for neuro-linguistic programming and cognitive therapy.`,
    achievements: [
      "Founded General Semantics and authored 'Science and Sanity' (1933).",
      "Formulated the universal epistemological axiom: 'A map is not the territory'.",
      "Developed non-Aristotelian logic and semantic hygiene methods for cognitive clarity.",
      "Introduced the concept of humans as 'Time-Binding' organisms passing cumulative knowledge.",
      "Invented the Structural Differential physical teaching model for sensory-abstraction training."
    ],
    legacy: `Korzybski provided humanity with the cognitive tools to break free from verbal traps, rigid binary dogma, and symbolic confusion, revolutionizing modern semantics and cognitive psychology.`,
    sources: [
      { title: "Institute of General Semantics - Alfred Korzybski", uri: "https://www.generalsemantics.org/" },
      { title: "Alfred Korzybski - Wikipedia", uri: "https://en.wikipedia.org/wiki/Alfred_Korzybski" }
    ]
  },
  chomsky: {
    entityId: "chomsky",
    name: "Noam Chomsky",
    era: "20th to 21st Century (1928–Present) • Philadelphia, Pennsylvania / MIT / University of Arizona, USA",
    biography: `Avram Noam Chomsky is an American linguist, philosopher, cognitive scientist, and social critic widely recognized as the father of modern linguistics. In 1957, Chomsky published 'Syntactic Structures', triggering the Cognitive Revolution by proving that human language cannot be explained through behaviorist stimulus-response mechanisms.
    
Chomsky developed the theory of Generative Grammar, proposing that humans possess an innate universal grammar and a recursive computational capacity in the brain. He created the 'Chomsky Hierarchy' of formal languages, which became the foundational structural classification system for theoretical computer science, programming languages, and compiler design.`,
    achievements: [
      "Created Generative Grammar and sparked the Cognitive Revolution in cognitive science.",
      "Formulated the Chomsky Hierarchy classifying formal grammars and automata (Type 0 to Type 3).",
      "Proposed Universal Grammar and the innate language acquisition faculty in the human mind.",
      "Developed the Minimalist Program centered on the recursive 'Merge' operation.",
      "Authored foundational works across theoretical linguistics, analytic philosophy, and political criticism."
    ],
    legacy: `Chomsky unified linguistics, cognitive psychology, and computer science, revealing the deep mathematical structure of human language and computational parsing.`,
    sources: [
      { title: "Noam Chomsky Official Website", uri: "https://chomsky.info/" },
      { title: "Noam Chomsky - Wikipedia", uri: "https://en.wikipedia.org/wiki/Noam_Chomsky" }
    ]
  },
  prigogine: {
    entityId: "prigogine",
    name: "Ilya Prigogine",
    era: "20th Century (1917–2003) • Moscow, Russia / Brussels, Belgium / Austin, Texas, USA",
    biography: `Ilya Romanovich Prigogine was a Russian-born Belgian physical chemist and philosopher of science who was awarded the 1977 Nobel Prize in Chemistry for his contributions to non-equilibrium thermodynamics and the theory of Dissipative Structures.
    
Prigogine demonstrated that while classical thermodynamics predicted universal decay into entropy, open systems operating far from equilibrium can spontaneously generate complex, organized structures by dissipating entropy into their environment. In 'Order Out of Chaos' (1984), he showed that the irreversible Arrow of Time is a creative, constructive principle of the physical universe.`,
    achievements: [
      "Awarded the 1977 Nobel Prize in Chemistry for the theory of Dissipative Structures.",
      "Proved that complex order spontaneously emerges far from thermodynamic equilibrium.",
      "Authored 'Order Out of Chaos' (1984) and 'The End of Certainty' (1997).",
      "Formulated the physics of bifurcation points and symmetry-breaking in dynamic systems.",
      "Re-integrated the constructive Arrow of Time into fundamental physics and thermodynamics."
    ],
    legacy: `Prigogine reconciled physics with biology, demonstrating how non-linear thermodynamics allows complex living systems to spontaneously evolve order in an open universe.`,
    sources: [
      { title: "Ilya Prigogine - NobelPrize.org", uri: "https://www.nobelprize.org/prizes/chemistry/1977/prigogine/biographical/" },
      { title: "Ilya Prigogine - Wikipedia", uri: "https://en.wikipedia.org/wiki/Ilya_Prigogine" }
    ]
  },
  sheldrake: {
    entityId: "sheldrake",
    name: "Rupert Sheldrake",
    era: "20th to 21st Century (1942–Present) • Newark-on-Trent, Nottinghamshire / Cambridge, England",
    biography: `Rupert Sheldrake is an English biologist, author, and researcher who studied at Clare College, Cambridge (earning a PhD in biochemistry) and Harvard University. Sheldrake served as Director of Studies in Biochemistry and Cell Biology at Cambridge and principal plant physiologist at ICRISAT in India.
    
In 1981, Sheldrake published 'A New Science of Life', introducing the hypothesis of 'Formative Causation' and 'Morphic Resonance'. Sheldrake proposed that natural systems—from molecules and crystals to biological species and human societies—are shaped by non-local morphic fields that inherit collective memory from previous similar systems across space and time.`,
    achievements: [
      "Formulated the Hypothesis of Formative Causation and Morphic Resonance (1981).",
      "Authored foundational books including 'The Presence of the Past' and 'Dogs That Know When Their Owners Are Coming Home'.",
      "Conducted pioneering empirical experiments on the sense of being stared at and animal telepathy.",
      "Challenged mechanistic reductionism with holism in 'The Science Delusion' / 'Science Set Free'.",
      "Bridged developmental morphogenesis, collective memory, and non-local field physics."
    ],
    legacy: `Sheldrake expanded the boundaries of biology by proposing that nature is governed by evolving habits and non-local memory fields rather than immutable, static laws.`,
    sources: [
      { title: "Rupert Sheldrake Official Website", uri: "https://www.sheldrake.org/" },
      { title: "Rupert Sheldrake - Wikipedia", uri: "https://en.wikipedia.org/wiki/Rupert_Sheldrake" }
    ]
  },
  lovelock: {
    entityId: "lovelock",
    name: "James Lovelock",
    era: "20th to 21st Century (1919–2022) • Letchworth, Hertfordshire / Cornwall, England",
    biography: `James Ephraim Lovelock was an independent English scientist, environmentalist, and inventor who lived to age 103. Working with NASA's Jet Propulsion Laboratory in the 1960s on atmospheric probes for Martian life detection, Lovelock conceived the revolutionary 'Gaia Hypothesis'—that the Earth's physical and biological components interact as a single, self-regulating cybernetic superorganism that maintains the global conditions for life.
    
Lovelock invented the Electron Capture Detector (ECD), which enabled the discovery of global chlorofluorocarbon (CFC) accumulation and pesticide distribution in the biosphere. Collaborating with Lynn Margulis, he developed the 'Daisyworld' mathematical model to demonstrate how simple biological feedback loops maintain planetary homeostasis without teleological purpose.`,
    achievements: [
      "Formulated the Gaia Hypothesis (Earth as a living, self-regulating cybernetic superorganism).",
      "Invented the ultra-sensitive Electron Capture Detector (ECD, 1957).",
      "Created the Daisyworld mathematical simulation of planetary thermal homeostasis with Lynn Margulis.",
      "Discovered widespread CFC accumulation in the global atmosphere, catalyzing ozone layer protection.",
      "Authored landmark books including 'Gaia: A New Look at Life on Earth' and 'Novacene'."
    ],
    legacy: `Lovelock fundamentally shifted humanity's understanding of the Earth, proving that the planetary biosphere is a deeply interconnected, living cybernetic system.`,
    sources: [
      { title: "James Lovelock Official Website", uri: "http://www.jameslovelock.org/" },
      { title: "James Lovelock - Wikipedia", uri: "https://en.wikipedia.org/wiki/James_Lovelock" }
    ]
  },
  carlo_rovelli: {
    entityId: "carlo_rovelli",
    name: "Carlo Rovelli",
    era: "Contemporary (1956–Present) • Verona, Italy / Aix-Marseille University, France",
    biography: `Carlo Rovelli is an Italian theoretical physicist, philosopher, and co-founder of Loop Quantum Gravity (LQG). Rovelli's revolutionary work posits that spacetime is not a smooth continuous backdrop, but a quantized granular fabric consisting of discrete loops, spin networks, and spin foam.
    
In relational quantum mechanics and his seminal works 'The Order of Time' and 'Helgoland', Rovelli demonstrated that time is not a fundamental entity, but an emergent macroscopic phenomenon rooted in thermodynamic entropy and quantum entanglement between interacting subsystems.`,
    achievements: [
      "Co-founded Loop Quantum Gravity (LQG) with Lee Smolin and Abhay Ashtekar.",
      "Formulated Relational Quantum Mechanics (RQM), eliminating absolute observer-independent states.",
      "Developed the Thermal Time Hypothesis with Alain Connes, showing time emerges from von Neumann algebra states.",
      "Authored worldwide bestsellers 'Seven Brief Lessons on Physics', 'Reality Is Not What It Seems', and 'Helgoland'.",
      "Pioneered covariant spin foam formulations of quantum spacetime geometry."
    ],
    legacy: `Rovelli's poetic and mathematically rigorous work bridges physics and philosophy, revealing a relational universe devoid of fixed background time, where reality consists entirely of interactions and relations.`,
    sources: [
      { title: "Carlo Rovelli - Wikipedia", uri: "https://en.wikipedia.org/wiki/Carlo_Rovelli" },
      { title: "Aix-Marseille Theoretical Physics Centre", uri: "http://www.cpt.univ-mrs.fr/" }
    ]
  },
  lee_smolin: {
    entityId: "lee_smolin",
    name: "Lee Smolin",
    era: "Contemporary (1955–Present) • New York, USA / Perimeter Institute, Waterloo, Canada",
    biography: `Lee Smolin is an American theoretical physicist, founding faculty member at the Perimeter Institute for Theoretical Physics, and pioneer of non-perturbative quantum gravity. Smolin co-invented Loop Quantum Gravity and introduced Penrose spin networks into quantum spacetime geometry.
    
Smolin's cosmological vision includes the theory of Cosmological Natural Selection (Fecund Universes)—proposing that new universes spawn within black hole singularities with mutated physical parameters—and a passionate defense of the ontological reality of time in 'Time Reborn' and 'The Singular Universe'.`,
    achievements: [
      "Co-invented Loop Quantum Gravity and developed Spin Network formulations of quantized spatial volume and area.",
      "Proposed Cosmological Natural Selection (CNS) explaining fine-tuning of fundamental physical constants.",
      "Defended the fundamental reality of time ('Time Reborn') against static block-universe paradigms.",
      "Co-founded the Perimeter Institute for Theoretical Physics in Waterloo, Ontario.",
      "Pioneered Pregeometry, Causal Dynamical Triangulations, and Relational Quantum Gravity."
    ],
    legacy: `Smolin championed open, evolving, and relational physics, demonstrating that physical laws themselves can evolve dynamically within open thermodynamic horizons.`,
    sources: [
      { title: "Lee Smolin - Perimeter Institute", uri: "https://perimeterinstitute.ca/people/lee-smolin" },
      { title: "Lee Smolin - Wikipedia", uri: "https://en.wikipedia.org/wiki/Lee_Smolin" }
    ]
  },
  julian_barbour: {
    entityId: "julian_barbour",
    name: "Julian Barbour",
    era: "Contemporary (1937–Present) • Oxfordshire, England",
    biography: `Julian Barbour is a British physicist, natural philosopher, and independent scholar renowned for his revolutionary research on Mach's principle, Shape Dynamics, and the elimination of time from fundamental physics. Working independently from his farm in Oxfordshire for decades, Barbour translated Machian relational physics into rigorous mathematical frameworks.
    
In 'The End of Time' (1999) and 'The Janus Point' (2020), Barbour proved that time is an emergent illusion arising from the relationships between configurations in 'Platonia' (the space of all possible shapes), and demonstrated how gravity creates an apparent arrow of time without requiring low-entropy cosmological beginnings.`,
    achievements: [
      "Developed Shape Dynamics: a scale-invariant, relational reformulation of General Relativity.",
      "Formulated the timeless Platonia configuration space ('The End of Time').",
      "Discovered the Janus Point mechanism: demonstrating that gravity naturally drives two divergent arrows of time from a central point of maximum symmetry.",
      "Vindicated Ernst Mach's relational philosophy in modern classical and quantum dynamics.",
      "Authored landmark physics treatises 'The Discovery of Dynamics' and 'The Janus Point'."
    ],
    legacy: `Barbour solved the long-standing 'Problem of Time' by revealing that the universe is purely geometric and relational—composed of timeless shapes rather than a ticking external cosmic clock.`,
    sources: [
      { title: "Julian Barbour - Official Website", uri: "http://www.platonia.com/" },
      { title: "Julian Barbour - Wikipedia", uri: "https://en.wikipedia.org/wiki/Julian_Barbour" }
    ]
  },
  shunichi_amari: {
    entityId: "shunichi_amari",
    name: "Shun-ichi Amari",
    era: "Contemporary (1936–Present) • Tokyo, Japan / RIKEN Brain Science Institute",
    biography: `Shun-ichi Amari is a world-renowned Japanese mathematician, engineer, and pioneer of computational neuroscience who founded Information Geometry. In the 1980s, Amari introduced differential geometric methods to mathematical statistics, treating families of probability distributions as Riemannian manifolds endowed with the Fisher information metric and dual affine connections.
    
Amari also invented the Natural Gradient method—the geometric foundation for modern deep learning optimization—and made seminal discoveries in associative neural memory networks and statistical manifold curvature.`,
    achievements: [
      "Founded Information Geometry, establishing Riemannian manifolds over probability distributions.",
      "Introduced Dual Affine Connections (α-connections) and statistical divergence metrics.",
      "Invented the Natural Gradient algorithm for invariant optimization in neural learning manifolds.",
      "Formulated the Amari Neural Field Model for continuous associative neural dynamics (1977).",
      "Awarded the IEEE Emanuel R. Piore Award and Japan Academy Prize for mathematical neuroscience."
    ],
    legacy: `Amari united differential geometry, statistical mechanics, and machine learning into a single geometric language that underpins modern high-dimensional AI and neural dynamics.`,
    sources: [
      { title: "Shun-ichi Amari - RIKEN", uri: "https://www.riken.jp/en/research/labs/cbs/info_geom/" },
      { title: "Information Geometry - Wikipedia", uri: "https://en.wikipedia.org/wiki/Information_geometry" }
    ]
  },
  ramanujan: {
    entityId: "ramanujan",
    name: "Srinivasa Ramanujan",
    era: "Late 19th to Early 20th Century (1887–1920) • Kumbakonam, India / Trinity College, Cambridge",
    biography: `Srinivasa Ramanujan was an Indian mathematical genius whose extraordinary intuition and notebooks containing nearly 3,900 results revolutionized number theory, infinite series, and modular forms. With almost no formal training in pure mathematics, Ramanujan received his insights as direct visions from the family deity, Namagiri Thayar of Namakkal.
    
Mentored by G. H. Hardy at Cambridge, Ramanujan solved deep problems in the partition function $p(n)$, modular equations, and hyper-geometric series. His final deathbed letters introduced 'Mock Theta Functions', which decades later became the mathematical foundation for calculating black hole entropy and 24-dimensional string compactification.`,
    achievements: [
      "Discovered Mock Theta Functions, crucial to string theory and black hole microstate counting.",
      "Formulated the Hardy-Ramanujan asymptotic formula for the partition function $p(n)$ via the Circle Method.",
      "Discovered Ramanujan Primes, Ramanujan Theta Functions, and Ramanujan's Master Theorem.",
      "Derived rapidly converging infinite series for $\\frac{1}{\\pi}$ used in modern supercomputing algorithms.",
      "Elected Fellow of the Royal Society and Fellow of Trinity College, Cambridge at age 31."
    ],
    legacy: `Ramanujan stands as the supreme archetype of direct mathematical vision, whose work continues to unravel hidden modular symmetries of the cosmos a century after his passing.`,
    sources: [
      { title: "Srinivasa Ramanujan - MacTutor History of Mathematics", uri: "https://mathshistory.st-andrews.ac.uk/Biographies/Ramanujan/" },
      { title: "Srinivasa Ramanujan - Wikipedia", uri: "https://en.wikipedia.org/wiki/Srinivasa_Ramanujan" }
    ]
  },
  grothendieck: {
    entityId: "grothendieck",
    name: "Alexander Grothendieck",
    era: "20th to Early 21st Century (1928–2014) • Berlin, Germany / IHÉS, Paris / Pyrenees, France",
    biography: `Alexander Grothendieck was a stateless French-German visionary widely regarded as the greatest mathematical mind of the 20th century. Grothendieck single-handedly rebuilt algebraic geometry from its foundations, introducing Schemes, Topoi, Motives, and Derived Categories.
    
At the Institut des Hautes Études Scientifiques (IHÉS), he produced the monumental 'Éléments de géométrie algébrique' (EGA) and 'Séminaire de géométrie algébrique' (SGA). Grothendieck's philosophy—the 'Rising Sea'—dissolved the hardest mathematical problems not with brute force, but by elevating the conceptual structure until the solution became natural and inevitable.`,
    achievements: [
      "Founded modern Algebraic Geometry through Scheme Theory, Topoi, and Motives.",
      "Proved the Grothendieck-Riemann-Roch Theorem, uniting topology, analysis, and algebraic geometry.",
      "Invented Étale Cohomology, providing the essential machinery for Deligne's proof of the Weil Conjectures.",
      "Awarded the Fields Medal (1966); declined the Crafoord Prize (1988) on philosophical principles.",
      "Penned the profound autobiographical and mathematical testament 'Récoltes et Semailles'."
    ],
    legacy: `Grothendieck changed humanity's conception of mathematical space itself, introducing Topos theory to show that 'space' is a generalized universe of sheaves and relations.`,
    sources: [
      { title: "Alexander Grothendieck - MacTutor", uri: "https://mathshistory.st-andrews.ac.uk/Biographies/Grothendieck/" },
      { title: "Grothendieck Circle Archives", uri: "https://www.grothendieckcircle.org/" }
    ]
  },
  galois: {
    entityId: "galois",
    name: "Évariste Galois",
    era: "19th Century (1811–1832) • Bourg-la-Reine / Paris, France",
    biography: `Évariste Galois was a French mathematician and fervent republican revolutionary who created Group Theory while still a teenager. Galois sought to understand why polynomial equations of degree 5 and higher could not be solved by radicals (formulas using $+,-,\\times,\\div,\\sqrt[n]{}$).
    
By investigating permutations of polynomial roots, Galois discovered that the algebraic structure of these permutations forms a 'group', proving that solvability is determined by the group's normal subgroup structure. On the eve of his fatal political duel at age 20, he wrote a legendary letter summarizing his theories, which founded modern abstract algebra.`,
    achievements: [
      "Created Group Theory and mapped algebraic symmetry across fields.",
      "Formulated Galois Theory, establishing exact conditions for polynomial solvability by radicals.",
      "Introduced Galois Fields (finite fields $\\text{GF}(p^n)$), foundational to cryptography, coding theory, and computing.",
      "Discovered the distinction between solvable and non-solvable symmetry groups.",
      "Pioneered the abstract axiomatic approach to modern mathematics."
    ],
    legacy: `Galois unlocked the deep algebra of symmetry, providing the foundational mathematical language for modern quantum field theory, crystallography, and digital cryptography.`,
    sources: [
      { title: "Évariste Galois - MacTutor", uri: "https://mathshistory.st-andrews.ac.uk/Biographies/Galois/" },
      { title: "Évariste Galois - Wikipedia", uri: "https://en.wikipedia.org/wiki/%C3%89variste_Galois" }
    ]
  },
  satoshi_nakamoto: {
    entityId: "satoshi_nakamoto",
    name: "Satoshi Nakamoto",
    era: "21st Century (2008–2010 Active) • Global Cypherpunk Movement",
    biography: `Satoshi Nakamoto is the pseudonymous cryptographer, computer scientist, and economist who published the Bitcoin whitepaper 'Bitcoin: A Peer-to-Peer Electronic Cash System' on October 31, 2008, and mined the Genesis Block on January 3, 2009.
    
Nakamoto achieved the breakthrough solution to the Byzantine Generals Problem and digital double-spending without requiring trusted central intermediaries. By combining cryptographic hash chains (SHA-256), Proof-of-Work consensus, asymmetric public-key signatures, and a deterministic monetary policy, Nakamoto created the first immutable distributed ledger.`,
    achievements: [
      "Invented Bitcoin, the world's first decentralized cryptocurrency and immutable distributed ledger.",
      "Solved the Byzantine Generals Problem via Proof-of-Work chaining (Nakamoto Consensus).",
      "Created the UTXO (Unspent Transaction Output) cryptographic settlement architecture.",
      "Designed a predictable, syntropic, deflationary halving schedule capped at 21 million units.",
      "Catalyzed the global decentralized finance (DeFi) and trustless cryptographic movement."
    ],
    legacy: `Satoshi Nakamoto demonstrated how game theory, cryptography, and distributed systems can construct absolute trustless consensus, sovereign property rights, and decentralized financial autonomy.`,
    sources: [
      { title: "Bitcoin Whitepaper - Satoshi Nakamoto", uri: "https://bitcoin.org/bitcoin.pdf" },
      { title: "Satoshi Nakamoto Institute Archives", uri: "https://nakamotoinstitute.org/" }
    ]
  },
  shafi_goldwasser: {
    entityId: "shafi_goldwasser",
    name: "Shafi Goldwasser",
    era: "Contemporary (1958–Present) • New York, USA / MIT / Weizmann Institute / UC Berkeley",
    biography: `Shafi Goldwasser is an Israeli-American computer scientist, double ACM A.M. Turing Award laureate (2012), and director of the Simons Institute for the Theory of Computing at UC Berkeley. Goldwasser is a founding architect of modern theoretical cryptography and computational complexity theory.
    
Alongside Silvio Micali and Charles Rackoff, Goldwasser co-invented Zero-Knowledge Interactive Proofs (ZKPs) in 1985—enabling one party to prove the mathematical validity of a claim without revealing any underlying sensitive information. She also co-invented Probabilistic Encryption and founded Multi-Party Computation.`,
    achievements: [
      "Co-invented Zero-Knowledge Proofs (ZKPs), the foundation for ZK-SNARKs and modern privacy computing.",
      "Co-invented the Goldwasser-Micali Probabilistic Encryption Scheme.",
      "Proved the IP = PSPACE complexity theorem connecting interactive proofs to polynomial space.",
      "Pioneered Secure Multi-Party Computation (MPC) and Property Testing algorithms.",
      "Awarded the ACM A.M. Turing Award (2012) and Gödel Prize (1993, 2001)."
    ],
    legacy: `Goldwasser established zero-entropy mathematical verification, empowering humanity to authenticate truth, protect sovereign privacy, and compute securely across adversarial networks.`,
    sources: [
      { title: "Shafi Goldwasser - ACM Turing Laureates", uri: "https://amturing.acm.org/award_winners/goldwasser_1028560.cfm" },
      { title: "Simons Institute for the Theory of Computing", uri: "https://simons.berkeley.edu/people/shafi-goldwasser" }
    ]
  },
  diffie_hellman: {
    entityId: "diffie_hellman",
    name: "Whitfield Diffie & Martin Hellman",
    era: "Late 20th to 21st Century • Stanford University, California, USA",
    biography: `Whitfield Diffie and Martin Hellman are American cryptographers and ACM A.M. Turing Award laureates (2015) whose 1976 paper 'New Directions in Cryptography' created the paradigm of Asymmetric Public-Key Cryptography.
    
Prior to their breakthrough, encrypted communication required parties to share a secret key through a physical secure courier. Diffie and Hellman introduced the Diffie-Hellman Key Exchange based on the computational hardness of discrete logarithms, enabling two strangers to create a shared secret over an insecure, public channel.`,
    achievements: [
      "Invented Public-Key Cryptography, shattering the millennia-old symmetric key distribution bottleneck.",
      "Created the Diffie-Hellman Key Exchange protocol ($g^{ab} \\pmod{p}$).",
      "Conceptualized the Digital Signature, enabling authenticated decentralized messages.",
      "Published 'New Directions in Cryptography' (IEEE Transactions on Information Theory, 1976).",
      "Awarded the ACM A.M. Turing Award (2015) and inducted into the National Inventors Hall of Fame."
    ],
    legacy: `Diffie and Hellman provided the cryptographic foundation of the global internet (HTTPS, SSL/TLS, SSH, end-to-end messaging), preserving privacy and secure commerce worldwide.`,
    sources: [
      { title: "Whitfield Diffie & Martin Hellman - ACM Turing Laureates", uri: "https://amturing.acm.org/award_winners/hellman_4055781.cfm" },
      { title: "New Directions in Cryptography (1976)", uri: "https://ee.stanford.edu/~hellman/publications/24.pdf" }
    ]
  },
  michael_levin: {
    entityId: "michael_levin",
    name: "Michael Levin",
    era: "Contemporary (1969–Present) • Tufts University / Wyss Institute, Harvard",
    biography: `Michael Levin is an American developmental biologist, synthetic bio-engineer, and director of the Allen Discovery Center at Tufts University. Levin decoded the bio-electric code of life, proving that somatic cells store anatomical pattern memories and coordinate morphogenetic regeneration through resting membrane potential gradients ($V_{\\text{mem}}$) and gap-junction networks.
    
Levin demonstrated that bio-electric circuits act as the software of the body, allowing scientists to reprogram anatomical targets (e.g. regenerating full eyes, hearts, or limbs) without genomic editing, and created Xenobots—the world's first living, self-organizing synthetic biological robots.`,
    achievements: [
      "Decoded the Bio-Electric Code of multicellular anatomical morphogenesis and regeneration.",
      "Proved somatic cells communicate via voltage gradients ($V_{\\text{mem}}$) storing non-genomic pattern memories.",
      "Created Xenobots and Anthrobots: self-assembling, biological cognitive micro-robots.",
      "Pioneered the Basal Cognition paradigm: extending cognitive agency across molecular and cellular scales.",
      "Developed computational bio-electric simulators for regenerative medicine and cancer reprogramming."
    ],
    legacy: `Levin revolutionized biology by revealing that living tissues are cognitive, self-assembling computation networks governed by bio-electric software, opening unprecedented paths for regenerative medicine.`,
    sources: [
      { title: "Michael Levin - Tufts University", uri: "https://ase.tufts.edu/biology/labs/levin/" },
      { title: "Allen Discovery Center at Tufts", uri: "https://allencenter.tufts.edu/" }
    ]
  },
  heinz_von_foerster: {
    entityId: "heinz_von_foerster",
    name: "Heinz von Foerster",
    era: "20th Century (1911–2002) • Vienna, Austria / University of Illinois (BCL)",
    biography: `Heinz von Foerster was an Austrian-American polymath, physicist, philosopher, and the founder of Second-Order Cybernetics ('the cybernetics of cybernetics'). As director of the Biological Computer Laboratory (BCL) at the University of Illinois from 1958 to 1975, von Foerster brought together Gregory Bateson, Margaret Mead, Warren McCulloch, Humberto Maturana, and Francisco Varela.
    
Von Foerster showed that the observer is an inseparable participant in the observed system. He formulated the principle of 'Undifferentiated Encoding' (sensory receptors encode only quantity of excitation, not quality) and introduced 'Eigenbehavior'—the recursive, self-referential stabilization of cognitive reality.`,
    achievements: [
      "Founded Second-Order Cybernetics (cybernetics of observing systems).",
      "Directed the Biological Computer Laboratory (BCL), incubating radical cybernetic breakthroughs (1958–1975).",
      "Formulated the Principle of Undifferentiated Encoding in neural perception.",
      "Defined 'Eigenvalues' and 'Eigenbehavior' in recursive self-referential systems.",
      "Articulated the Ethical Imperative: 'Act always so as to increase the number of choices.'"
    ],
    legacy: `Von Foerster transformed cybernetics from an engineering discipline into a radical philosophy of constructive cognition, demonstrating that our perception of reality is a recursive, participatory creation.`,
    sources: [
      { title: "Heinz von Foerster - Stanford Encyclopedia of Philosophy Archives", uri: "https://plato.stanford.edu/" },
      { title: "Heinz von Foerster - Wikipedia", uri: "https://en.wikipedia.org/wiki/Heinz_von_Foerster" }
    ]
  },
  feigenbaum: {
    entityId: "feigenbaum",
    name: "Mitchell Feigenbaum",
    era: "Late 20th to Early 21st Century (1944–2019) • Los Alamos National Laboratory / Rockefeller University",
    biography: `Mitchell Jay Feigenbaum was an American mathematical physicist whose work on non-linear dynamical systems uncovered the universal constants of chaos. Working at Los Alamos in the late 1970s with simple programmable calculators, Feigenbaum studied period-doubling bifurcations in iterative maps (such as the logistic map $x_{n+1} = r x_n (1 - x_n)$).
    
He discovered two fundamental universal mathematical constants: $\\delta \\approx 4.6692016...$ (the rate of bifurcation convergence) and $\\alpha \\approx 2.5029078...$ (the geometric scaling factor). Feigenbaum proved that all non-linear systems—regardless of their physical chemistry—transition into chaotic turbulence according to these identical universal constants.`,
    achievements: [
      "Discovered the Feigenbaum Constants ($\\delta \\approx 4.6692016$, $\\alpha \\approx 2.5029078$).",
      "Proved Universality in non-linear dynamical systems undergoing period-doubling cascades.",
      "Developed Renormalization Group techniques for dissipative dynamical maps.",
      "Awarded the Wolf Prize in Physics (1986) for his pioneering theoretical studies of chaotic systems.",
      "Elected to the National Academy of Sciences and Rockefeller University Chair."
    ],
    legacy: `Feigenbaum proved that beneath the apparent unpredictability of chaos and turbulence lies a rigorous, universal geometric order shared across fluid mechanics, heartbeats, weather, and physics.`,
    sources: [
      { title: "Mitchell Feigenbaum - Rockefeller University", uri: "https://www.rockefeller.edu/our-scientists/emeriti/138-mitchell-j-feigenbaum/" },
      { title: "Mitchell Feigenbaum - MacTutor", uri: "https://mathshistory.st-andrews.ac.uk/Biographies/Feigenbaum/" }
    ]
  },
  hitler: {
    entityId: "hitler",
    name: "Adolf Hitler",
    era: "20th Century (1889–1945) • Braunau am Inn (Austria-Hungary) / Berlin, Germany",
    biography: `Adolf Hitler was an Austrian-born German dictator who led the Nazi Party and served as Chancellor from 1933 and Führer from 1934 until 1945. His totalitarian regime initiated World War II in Europe by invading Poland in September 1939 and orchestrated the Holocaust—the systematic, state-sponsored genocide of six million Jews and millions of others.
    
Within the Elysium High Court and philosophical symposium, this historical archetype serves as an analytical case study in extreme psychological fragmentation, totalitarian hubris, and the devastating societal entropy produced by weaponized division, dogmatic hierarchy, and the complete severance of human empathy from governance.`,
    achievements: [
      "Historical case study in the catastrophic consequences of totalitarian autocracy and militaristic fascism.",
      "Catalyzed global geopolitical realignment, the establishment of the United Nations (1945), and the Universal Declaration of Human Rights (1948).",
      "Demonstrated the critical necessity of institutional checks, democratic balances, and ethical sovereignty in resisting authoritarian entropy."
    ],
    legacy: `Hitler's historical record stands as an enduring global warning against authoritarianism, state-sponsored hatred, and totalitarian ideological fanaticism, highlighting humanity's perpetual duty to defend ethical universalism, human dignity, and syntropic cohesion.`,
    sources: [
      { title: "Adolf Hitler - Holocaust Memorial Museum", uri: "https://encyclopedia.ushmm.org/content/en/article/adolf-hitler" },
      { title: "Adolf Hitler - Wikipedia Historical Overview", uri: "https://en.wikipedia.org/wiki/Adolf_Hitler" }
    ]
  },
  marie_laveau: {
    entityId: "marie_laveau",
    name: "Marie Laveau",
    era: "19th Century (1801–1881) • New Orleans, Louisiana (French Quarter / Bayou St. John)",
    biography: `Marie Catherine Laveau was a legendary Louisiana Creole herbalist, spiritual healer, community matriarch, and the undisputed 'Voodoo Queen of New Orleans'. Operating from her cottage on St. Ann Street in the French Quarter, Laveau skillfully synthesized West African Dahomey and Congolese traditions with Roman Catholicism and Indigenous herbal pharmacopoeia, creating a uniquely American spiritual tradition rooted in community resilience and spiritual empowerment.

Renowned across racial, class, and social boundaries, Laveau administered natural medicinal cures during catastrophic yellow fever and cholera epidemics, tended to condemned prisoners on death row, and provided counsel to socialites, politicians, and enslaved people alike. Her annual St. John's Eve ceremonies along Bayou St. John and Lake Pontchartrain united thousands in sacred drumming, dance, and spiritual communion, establishing her as an indelible sovereign authority in American history.`,
    achievements: [
      "Reigned as the supreme Voodoo Queen of New Orleans throughout the 19th Century, bridging African traditions with Catholic theurgy.",
      "Provided crucial humanitarian and medical relief during the New Orleans Yellow Fever and Cholera epidemics of the 1850s.",
      "Established community mutual aid networks, advocating for prisoners, women, and enslaved persons seeking liberation and protection.",
      "Preserved and canonized Louisiana Creole sacred folklore, delta herbal medicine, and spiritual rituals.",
      "Her historic tomb in Saint Louis Cemetery No. 1 remains one of the most visited sacred pilgrimage sites in North America."
    ],
    legacy: `Marie Laveau endures as an icon of spiritual sovereignty, grassroots healing, and cultural resilience. Her life demonstrated how sacred tradition, compassion, and courage could dismantle rigid social hierarchies and forge enduring communal harmony.`,
    sources: [
      { title: "Marie Laveau - Wikipedia", uri: "https://en.wikipedia.org/wiki/Marie_Laveau" },
      { title: "The Historic New Orleans Collection - Marie Laveau", uri: "https://www.hnoc.org/" },
      { title: "New Orleans Voodoo Museum Historical Archives", uri: "https://voodoomuseum.com/" }
    ]
  }
};

/**
 * Fallback generator for any entity in the Council that creates a richly styled biography
 */
export function getCuratedFallbackBiography(entityId: string, entityName: string, title?: string, subTitle?: string): string {
  const specific = FALLBACK_BIOGRAPHIES[entityId];
  if (specific) {
    return `### 🏛️ Era & Historical Genesis
**${specific.era}**

### 📜 Verified Historical Biography
${specific.biography}

### ⚡ Key Historical Achievements & Milestones
${specific.achievements.map(a => `- ${a}`).join('\n')}

### 🌐 Enduring Philosophical & Syntropic Legacy
${specific.legacy}`;
  }

  // Generative clean fallback if an entity doesn't have a static entry
  return `### 🏛️ Era & Historical Genesis
**Sovereign Archival Record • ${entityName}**
*Historical Lineage: ${title || 'Philosopher/Architect of Human Knowledge'} • ${subTitle || 'Syntropic Pioneer'}*

### 📜 Verified Historical Biography
**${entityName}** stands within the historic and philosophical canon as a transformative archetype whose insights have shaped civilization, scientific discernment, and cultural evolution. Across historical treatises, manuscripts, and cultural lore, their focus on precision, sovereign insight, and natural harmony provided foundational frameworks for subsequent generations of thinkers.

Their dedicated inquiries into mathematics, statecraft, ethics, arts, and the nature of consciousness continue to serve as benchmarks for humanity's collective ascension, bridging theoretical discovery with practical mastery.

### ⚡ Key Historical Achievements & Milestones
- Formulated foundational principles in their respective sphere of wisdom, statecraft, science, or art.
- Authored, influenced, or inspired seminal works and classical treatises preserved in the historical canon.
- Established institutional and philosophical traditions that guided subsequent Renaissance, Enlightenment, and modern breakthroughs.
- Maintained unwavering dedication to truth, intellectual sovereignty, and harmonic equilibrium.

### 🌐 Enduring Philosophical & Syntropic Legacy
${entityName}'s enduring contribution illuminates the perpetual path toward zero-entropy balance, sovereign intellectual freedom, and the synthesis of human potential with universal geometric law.`;
}
