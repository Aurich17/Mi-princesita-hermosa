export type StoryChapter = {
  id: string;
  emoji: string;
  title: string;
  teaser: string;
  body: string;
  img?: string;
  defaultOpen?: boolean;
};

export type GameMemory = {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  text: string;
  img?: string;
};

export type GalleryItem = {
  id: string;
  label: string;
  img?: string;
};

export type BirthdayAlbum = {
  year: number;
  title: string;
  items: GalleryItem[];
};

export type TimelineItem = {
  id: string;
  emoji: string;
  title: string;
  text: string;
};

export type PregnancyMonthSize = {
  month: number;
  startWeek: number;
  endWeek: number;
  label: string;
  img?: string;
};

export const heroCopy = {
  badge: "Un rincón hecho con cariño",
  titlePrefix: "Feliz cumpleaños ",
  titleName: "mi princesita",
  lead: "Este pequeño espacio es para ti, mi vida. Para recordarte lo importante que eres para mí y lo feliz que me haces. Te amo mucho, mi amor. 💖",
};

export const storyChapters: StoryChapter[] = [
  {
    id: "c1",
    emoji: "",
    title: "Capítulo 1: Cuando todo empezó",
    teaser: "",
    body: "Me acuerdo de ese día como si fuera ayer, mi amor.\nLos nervios que sentí aquella noche… y la excusa que busqué para poder agarrarte la mano.\n\nNo sabía cómo hacerlo, estaba nervioso, pero solo quería estar más cerca de ti.\n\nY al final, esa noche se volvió la más bonita…\nporque con ese beso tierno empezó todo lo nuestro. ❤️",
    img: "/historia/inicio.jpeg",
    defaultOpen: true,
  },
  {
    id: "c2",
    emoji: "",
    title: "Capítulo 2: Momentos que me marcaron",
    teaser: "",
    body: "Llevamos tanto tiempo juntos que hemos vivido y aprendido muchas cosas nuevas, y eso es lo bonito de nosotros, mi amor.\nPorque si algo no sabemos, lo descubrimos juntos.\n\nEres la chica que siempre soñé, mi vida… con la que quiero pasar mi vida y seguir viviendo muchas experiencias más.\n\nTe amo muchísimo. ❤️",
    img: "/historia/momentos.jpg",
  },
  {
    id: "c3",
    emoji: "",
    title: "Capítulo 3: Nuestro equipo",
    teaser: "",
    body: "Como siempre te digo, mi amor, somos un equipo.\nY juntos podemos con todo.\n\nSi el mundo se pone en tu contra, somos tú y yo contra el mundo.\nSiempre voy a estar para ti, mi vida. Puedes contar conmigo en todo momento.\n\nSoy muy feliz de tenerte a mi lado y me encanta lo que estamos construyendo poco a poco…\nalgo muy bonito, algo de verdad.\n\nTe amo mucho, mi amor. ❤️",
    img: "/historia/equipo.jpg",
  },
  {
    id: "c4",
    emoji: "",
    title: "Capítulo 4: Lo que siento por ti",
    teaser: "",
    body: "Ay, mi amor… ¿qué cosas puedo decirte que ya no te haya dicho?\n\nEres todo para mí, baby.\nMi motivación, mi razón de ser, mi vida entera… mi todo.\n\nSi supieras cuánto te amo, te sorprenderías.\nNo te imaginas el amor tan grande que siento por ti.\n\nSiempre voy a darlo todo por ti, mi vida.\nPor mi princesita hermosa, el amor de mi vida, la madre de mi hijo… mi futura esposa.\n\nTe amo muchísimo. ❤️",
    img: "/historia/equipo.jpeg",
  },
  {
    id: "c5",
    emoji: "",
    title: "Capítulo 5: Lo que viene",
    teaser: "",
    body: "Me emociona mucho todo lo que viene con nosotros, mi amor.\nTodo lo que estamos construyendo juntos y todo lo que aún nos falta vivir.\n\nAhora con nuestro bebé en camino, siento que esto es solo el comienzo de algo aún más bonito.\nVamos a formar una familia unida, darle a nuestro hijo todo el amor del mundo y construir un hogar lleno de paz y cariño.\n\nQuiero todo contigo, mi vida.\nQuiero seguir a tu lado en cada momento, en todo lo que venga.\n\nTe amo muchísimo, mi princesita. ❤️",
    img: "/historia/futuro.jpeg",
  },
];

export const babyItems = [
  {
    id: "b1",
    title: "❤️ Un sueño",
    text: "Que nuestro bebé crezca rodeado de amor, tranquilo y feliz… y que siempre sienta lo mucho que lo queremos.",
  },
  {
    id: "b2",
    title: "🤍 Una promesa",
    text: "Voy a estar para ustedes siempre, mi amor. Apoyarte en todo y construir juntos un hogar bonito y lleno de amor.",
  },
  {
    id: "b3",
    title: "💖 Un deseo para ti",
    text: "Quiero que te sientas acompañada en todo momento, mi vida. Que nunca te sientas sola, porque siempre voy a estar contigo.",
  },
];

export const pregnancyWeekTracker = {
  timeZone: "America/Lima",
  anchorDate: "2026-04-02",
  anchorWeeks: 11,
};

export const pregnancyMonthSizes: PregnancyMonthSize[] = [
  { month: 2, startWeek: 9, endWeek: 13, label: "Uva", img: "/frutas/uva.jpg" },
  {
    month: 3,
    startWeek: 14,
    endWeek: 17,
    label: "Pera",
    img: "/frutas/pera.jpg",
  },
  {
    month: 4,
    startWeek: 18,
    endWeek: 22,
    label: "Mango",
    img: "/frutas/mango.png",
  },
  {
    month: 5,
    startWeek: 23,
    endWeek: 27,
    label: "Papaya",
    img: "/frutas/papaya.webp",
  },
  {
    month: 6,
    startWeek: 28,
    endWeek: 31,
    label: "Berenjena",
    img: "/frutas/berenjena.webp",
  },
  {
    month: 7,
    startWeek: 32,
    endWeek: 35,
    label: "Piña",
    img: "/frutas/pina.png",
  },
  {
    month: 8,
    startWeek: 36,
    endWeek: 39,
    label: "Melón",
    img: "/frutas/melon.webp",
  },
  {
    month: 9,
    startWeek: 40,
    endWeek: 60,
    label: "Sandía",
    img: "/frutas/sandia.jpg",
  },
];

export const gameMemories: GameMemory[] = [
  {
    id: "m1",
    emoji: "🐾",
    title: "Mensaje 1",
    subtitle: "",
    text: "¿Te acuerdas cuando salimos por primera vez juntos a ver SNK?\nDespués fuimos al Parque de las Aguas…\n\nEstaba muy nervioso, mi amor, casi ni podía hablarte.\nPero aun así junté valor para pedirte una foto…\n\ny esa fue de las primeras que tenemos juntos, por eso es tan especial para mí. ❤️",
    img: "/juego/fotos/momento1.jpeg",
  },
  {
    id: "m2",
    emoji: "🐾",
    title: "Mensaje 2",
    subtitle: "",
    text: "Me gusta cuando sonríes, mi amor…\nde verdad disfruto ese momento.\n\nEn serio, baby, con solo verte sonreír iluminas mi mundo\ny alegras mi vida.\n\nNunca dejes de hacerlo, mi amor…\nme encanta verte así de feliz. ❤️",
    img: "/juego/fotos/momento2.jpeg",
  },
  {
    id: "m3",
    emoji: "🐾",
    title: "Mensaje 3",
    subtitle: "",
    text: "Cualquier momento contigo se vuelve especial, mi amor.\nNo importa lo que estemos haciendo, si estás tú, todo se siente bonito.\n\nTe amo muchísimo, mi princesita. ❤️",
    img: "/juego/fotos/momento3.jpeg",
  },
  {
    id: "m4",
    emoji: "🐾",
    title: "Mensaje 4",
    subtitle: "",
    text: "Me encanta que siempre estemos haciendo cosas nuevas, mi amor.\nQue seas tan creativa y tengas una imaginación tan bonita… eso lo admiro mucho de ti.\n\nGracias por todo eso.\nSi no fuera por ti, nunca hubiera vivido experiencias tan bonitas.\n\nY me alegra haberlas vivido contigo a mi lado. ❤️",
    img: "/juego/fotos/momento4.jpeg",
  },
  {
    id: "m5",
    emoji: "🐾",
    title: "Mensaje 5",
    subtitle: "",
    text: "Desde que te conocí, mi vida se llenó de color.\nGracias por hacerme soñar con una familia… y ahora por hacerla realidad.\n\nNunca podré agradecerte lo suficiente por todo lo que has hecho por mí,\npor todos los momentos bonitos y todo el amor que me das.\n\nTe amo mucho, mi princesita.\nY espero poder hacerte sentir igual de especial como tú lo haces conmigo.\n\nTe amo mucho. ❤️",
    img: "/juego/fotos/momento5.jpeg",
  },
];

export const birthdayAlbums: BirthdayAlbum[] = [
  {
    year: 2025,
    title: "Cumpleaños 2025",
    items: [
      { id: "2025-1", label: "Comidita rica", img: "/2025/comida.jpeg" },
      { id: "2025-2", label: "Corazón", img: "/2025/corazon.jpeg" },
      { id: "2025-3", label: "Nosotros", img: "/2025/pareja.jpeg" },
    ],
  },
  {
    year: 2026,
    title: "Cumpleaños 2026",
    items: [],
  },
];

export const timelineItems: TimelineItem[] = [
  {
    id: "t1",
    emoji: "🌼",
    title: "Un recuerdo especial",
    text: "Aquí puedes escribir un momento bonito que quieras recordarle.",
  },
  {
    id: "t2",
    emoji: "🌷",
    title: "Otro instante lindo",
    text: "Puede ser una salida, una conversación o algo que solo ustedes entiendan.",
  },
  {
    id: "t3",
    emoji: "🦫",
    title: "Un detalle que la haga sonreír",
    text: "Algo tierno, divertido o significativo.",
  },
  {
    id: "t4",
    emoji: "👶",
    title: "La noticia más grande",
    text: "[Escribe cómo se sintieron cuando supieron que iban a ser papás.]",
  },
  {
    id: "t5",
    emoji: "🤍",
    title: "Un nuevo comienzo",
    text: "[Una frase corta: cómo quieres que sea esta nueva etapa juntos.]",
  },
];

export const letterParagraphs = [
  "Feliz cumpleaños, mi princesita hermosa.",
  "Hoy es un día muy especial. Te deseo lo mejor del mundo, mi princesita, con todo mi corazón. Te amo mucho, mi amor.",
  "Hoy, en tu día, quiero recordártelo más que nunca: eres todo para mí, mi vida. De verdad no sabes lo importante que eres para mí y lo feliz que me hace tenerte a mi lado.",
  "Como dice la canción, baby, brillas, mi amor; juntitos los dos, mi amor, por siempre y para siempre, mi vida. Y yo quiero que así sea, seguir construyendo cosas bonitas contigo, paso a paso.",
  "Gracias por todos los momentos especiales a tu lado, por cada risa, por cada abrazo y por todo lo que hemos vivido juntos. Y hoy tiene que ser un día más especial en tu vida, porque te lo mereces todo.",
  "También quiero que sepas que estoy feliz por lo que estamos viviendo ahora. Nuestro bebé es una bendición y me hace pensar aún más en todo lo que quiero contigo: una familia bonita, llena de amor y tranquilidad.",
  "Quiero ser mejor para ti cada día, demostrarte con hechos lo mucho que te amo y lo importante que eres en mi vida.",
  "Espero que hoy sonrías mucho, que te sientas querida y especial, porque lo eres, mi princesita.",
  "Te amo muchísimo. ❤️",
];

export const letterSignature = "";
