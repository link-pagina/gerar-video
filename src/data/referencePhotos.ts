import { ReferencePhoto } from '../types/script';

export const GOOGLE_DRIVE_PHOTOS_FOLDER_URL =
  'https://drive.google.com/drive/folders/1AWmLJg5bIdLsDTcHJKJGwS8PpDW_BBIA?usp=drive_link';

// Extracted directly from the user's shared Google Drive folder
export const DRIVE_PHOTOS_RAW = [
  { number: 1, id: '1UKyWhtewAaXQaIfaGtuYvATXKl_M46TP', gender: 'male', title: 'Homem jovem com barba suave e olhar acolhedor' },
  { number: 2, id: '1bg_bx78CgFS_x_iituS0Zz1YHqHBeSbp', gender: 'female', title: 'Mulher jovem serena com luz suave' },
  { number: 3, id: '1EGuVyM28jsHaPPQIdcgMrsTOXqn4jg8h', gender: 'male', title: 'Homem maduro com olhar reflexivo' },
  { number: 4, id: '1c-bcLjk8kUBooP_p_YUQZ3Dkf85AmV-B', gender: 'female', title: 'Mulher com expressão de paz e fé' },
  { number: 5, id: '1MqzdMCVIHpi4_q_CRrfpMOy6P2Hhmrjk', gender: 'male', title: 'Jovem compenetrado em postura devocional' },
  { number: 6, id: '12uRAerWoDceV6BnzK-iD3Phnjq06AivY', gender: 'female', title: 'Mulher jovem com olhar de esperança' },
  { number: 7, id: '10rMB1S1PFm1jjNkpmzOlyDvIDFMJG_mz', gender: 'male', title: 'Homem com olhar sábio e compassivo' },
  { number: 8, id: '1aZXGgVR2CRdM5QjJqqS8xdZm5sXHy5vA', gender: 'female', title: 'Mulher com expressão calorosa' },
  { number: 9, id: '1EZ3wRIgYYEQDvGJAt94qrHriM9n_ss1j', gender: 'male', title: 'Rapaz com olhar de gratidão e fé' },
  { number: 10, id: '11x9ibngxhE9BT7i2BwU8D-8ho7P--PUz', gender: 'female', title: 'Mulher serena em ambiente acolhedor' },
  { number: 11, id: '1BKQ1QjFgqLFJYPYIj__KbpF7sGseA3cC', gender: 'male', title: 'Homem jovem com postura humilde' },
  { number: 12, id: '1qrN--aCya7aUl3o3u8NBiiqpA17NboJL', gender: 'female', title: 'Mulher madura com semblante de oração' },
  { number: 14, id: '1B0ZeD_vu4JHndMKOHJtolVj2Byu2rkyX', gender: 'male', title: 'Homem com expressão marcante e sincera' },
  { number: 15, id: '1beKlkOA70e7HzIlf6i7T46d4q76dtR62', gender: 'female', title: 'Jovem mulher com olhar sereno' },
  { number: 16, id: '1F6KYF3hGsr5HKJVpI8VFtw7sZ-p_oZiM', gender: 'male', title: 'Homem com traços firmes e acolhedores' },
  { number: 17, id: '1DL07huXSFjjyaCLZFToRSHqnFvleU4iF', gender: 'female', title: 'Mulher com sorriso brando de paz' },
  { number: 18, id: '1K6O9ESMdxycz7quKDmplZQBl7QGTo8AX', gender: 'male', title: 'Homem jovem com postura reflexiva' },
  { number: 19, id: '1bed7DPS7UE3N67dw-xHuvmqFugZ4HbOg', gender: 'female', title: 'Mulher com semblante edificante' },
  { number: 20, id: '1m8Ri1UyGb4vk_LLknT_FPAjGmy4y5pht', gender: 'male', title: 'Homem maduro com olhar confortador' },
  { number: 21, id: '16MKHDOuPAC7tiVT9Gmxki_HraYSBRmmh', gender: 'female', title: 'Jovem com olhar luminoso e sincero' },
  { number: 22, id: '1JvSm6IrHl1vKTikub3TTJhksg8RYVM1T', gender: 'male', title: 'Homem jovem com expressão de fé profunda' },
  { number: 23, id: '1uFJXm2GAITCb-zKKYxbUE5dZU74_zm69', gender: 'female', title: 'Mulher madura cheia de serenidade' },
  { number: 24, id: '1N-_x6AhuYOfd3SuJ5licZtjf03LVSdg8', gender: 'male', title: 'Homem com olhar transparente e paternal' },
  { number: 25, id: '1d8P-R7RwaSooU8kJt_i0DCtA5id16osY', gender: 'female', title: 'Mulher jovem em momento de reflexão' },
];

export const REFERENCE_PHOTOS: ReferencePhoto[] = DRIVE_PHOTOS_RAW.map((item) => {
  const isFemale = item.gender === 'female';
  const age = isFemale ? 'Aproximadamente 27-32 anos' : 'Aproximadamente 29-35 anos';
  const skin = isFemale ? 'Tom de pele natural e acolhedor' : 'Tom de pele moreno claro e quente';
  const hair = isFemale ? 'Cabelos naturais ondulados sobre os ombros' : 'Cabelo curto alinhado com barba suave';
  const expression = 'Olhar direto, acolhedor, sereno e reflexivo';
  const clothing = isFemale ? 'Blusa em tom neutro e natural (linho/algodão off-white)' : 'Camisa de linho neutra bege ou clara com gola aberta';
  const lighting = 'Luz natural de golden hour suave com iluminação cinematográfica';
  const scene = 'Ambiente devocional acolhedor com tons terrosos e fundo suavemente desfocado';

  const charEn = isFemale
    ? `A contemplative woman in her early 30s with natural warm complexion, natural hair resting over shoulders, deep compassionate and attentive eyes looking straight into the camera, wearing an understated neutral linen top`
    : `A contemplative man in his early 30s with warm olive complexion, neatly groomed short beard and hair, direct sincere and compassionate eyes looking straight into the camera, wearing a simple textured neutral linen shirt`;

  return {
    id: `drive-photo-${item.number}`,
    number: item.number,
    name: `Foto ${item.number} — ${item.title}`,
    apparentAge: age,
    skinTone: skin,
    hair: hair,
    expression: expression,
    clothing: clothing,
    lighting: lighting,
    scene: scene,
    // Direct Google Drive image thumbnail from user's shared folder:
    imageUrl: `https://lh3.googleusercontent.com/d/${item.id}`,
    confirmationDescription: `Foto ${item.number} localizada na pasta do Drive: ${item.title}. Postura em plano médio, olhar direto e compassivo para a câmera, iluminação suave e natural em ambiente devocional acolhedor.`,
    characterDescriptionEn: charEn,
  };
});
