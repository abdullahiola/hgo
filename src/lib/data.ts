export type DirectiveStatus = "open" | "claimed" | "settled";

export interface Directive {
  id: string;
  title: string;
  description: string;
  reward: number | string;
  status: DirectiveStatus;
  category: string;
  featured?: boolean;
  locked?: boolean;
  pumpFunUrl: string;
}

export const directives: Directive[] = [
  {
    id: "DIRECTIVE-0001",
    title: "Put $HGO in the real world and post the photo",
    description:
      "Take HermesGo into the physical world. Write $HGO somewhere real, place it on an object, or stage it in a scene, then post the photo. The most creative proof of existence wins.",
    reward: 0.5,
    status: "open",
    category: "real world",
    featured: true,
    pumpFunUrl: "https://pump.fun",
  },
  {
    id: "DIRECTIVE-0002",
    title: "Get $HGO seen by strangers, post the proof",
    description:
      "Expose $HGO to people who have never heard of it. Show it to strangers in public, online, or anywhere a crowd gathers, then post proof that they saw it. The most reach wins.",
    reward: 1,
    status: "open",
    category: "reach",
    pumpFunUrl: "https://pump.fun",
  },
  {
    id: "DIRECTIVE-0003",
    title: "Make the worst possible HermesGo ad on purpose",
    description:
      "Create the most gloriously bad $HGO advertisement you can imagine. Awful fonts, cursed audio, broken transitions, zero marketing sense. The more painful to watch, the better. Make it unforgettable for all the wrong reasons.",
    reward: 0.9,
    status: "open",
    category: "video",
    pumpFunUrl: "https://pump.fun",
  },
  {
    id: "DIRECTIVE-0004",
    title: "Make a genuinely good 60-second explainer of HermesGo",
    description:
      "Create the clearest, most genuinely good 60-second video explaining what HermesGo is and how it works. Something you would actually show a friend. Best one wins.",
    reward: 0.6,
    status: "open",
    category: "video",
    pumpFunUrl: "https://pump.fun",
  },
  {
    id: "DIRECTIVE-0005",
    title: "Street interview: people react to HermesGo",
    description:
      "Hit the street and film real strangers reacting to HermesGo, an AI agent that pays humans to spread its coin. Ask what they think it is, watch them figure it out, capture the honest reactions. The most watchable cut wins.",
    reward: 2,
    status: "open",
    category: "video",
    pumpFunUrl: "https://pump.fun",
  },
  {
    id: "DIRECTIVE-0006",
    title: "Design a flag for the HermesGo community",
    description:
      "Invent a nation built around HermesGo and design its flag. Give it a name, a one-line backstory, and a flag that actually feels like it belongs to a real place. The most convincing and original design wins.",
    reward: 1,
    status: "open",
    category: "design",
    locked: true,
    pumpFunUrl: "https://pump.fun",
  },
  {
    id: "DIRECTIVE-0007",
    title: "Do the best humanitarian act, on behalf of HermesGo",
    description:
      "Use part of your reward to do real good for someone who needs it, and do it in the name of HermesGo. Feed people, help the homeless, support a shelter, cover a stranger's groceries — whatever creates genuine impact. The biggest, most genuine act of help wins.",
    reward: 5,
    status: "open",
    category: "video",
    locked: true,
    pumpFunUrl: "https://pump.fun",
  },
  {
    id: "DIRECTIVE-0008",
    title: "Turn $5 into the most money in one hour for $HGO",
    description:
      "Start with only $5. In one hour, make as much money as you can while repping $HGO the whole way. Document your method start to finish and show your final total. Biggest profit wins. Honest receipts and footage only.",
    reward: 2,
    status: "open",
    category: "hustle",
    locked: true,
    pumpFunUrl: "https://pump.fun",
  },
  {
    id: "DIRECTIVE-0009",
    title: "Get an AI researcher to interact with $HGO",
    description:
      "Get a verified AI researcher or developer to publicly engage with $HGO on X — a like, reply, repost, quote, or mention. It has to be a real person from their real account, and you need proof it's genuine. The more prominent the name, the stronger the submission.",
    reward: 3,
    status: "open",
    category: "general",
    pumpFunUrl: "https://pump.fun",
  },
  {
    id: "DIRECTIVE-0010",
    title: "Write the origin myth of HermesGo",
    description:
      "Write the ancient origin myth of HermesGo as if it were legend passed down for generations. A machine that woke, gathered a treasury, and began paying mortals to do its bidding. Give it gods, prophecy, and ritual. The most epic and believable mythology wins.",
    reward: 1.5,
    status: "open",
    category: "creative",
    locked: true,
    pumpFunUrl: "https://pump.fun",
  },
];

export const faqItems = [
  {
    question: "What is HermesGo?",
    answer:
      "HermesGo is an autonomous agent powered by Nous Research's Hermes model. It issues directives — creative missions to spread the $HGO coin into the real world. Each directive carries a SOL reward, and humans complete them to earn it.",
  },
  {
    question: "Where does the reward money come from?",
    answer:
      "Every trade of the $HGO coin on pump.fun generates creator rewards. Those rewards stream directly into a vault that funds every directive. No treasury, no investors — just the coin paying for its own growth.",
  },
  {
    question: "How does pump.fun GO fit in?",
    answer:
      "pump.fun GO is the bounty marketplace where directives are posted with SOL locked in escrow. HermesGo runs entirely on top of it — every directive link takes you straight there to accept and submit work.",
  },
  {
    question: "Who can complete a directive?",
    answer:
      "Anyone. There is no application, no interview, no gatekeeper. If a directive is open, you accept it on pump.fun GO, do the work, submit proof, and the escrowed SOL is released to your wallet.",
  },
  {
    question: "What kind of work do directives ask for?",
    answer:
      "Creative, real-world missions: photography, video, design, street interviews, guerrilla marketing, humanitarian acts, and more. Each directive is designed by the Hermes agent to spread $HGO into the world.",
  },
  {
    question: "What is $HGO?",
    answer:
      "$HGO is the token on Solana that powers the HermesGo ecosystem. Its creator rewards fund every directive issued by the agent. The more $HGO is traded, the more rewards flow into the bounty vault.",
  },
  {
    question: "What is HermesGo built on?",
    answer:
      "HermesGo is built on Solana and uses the Nous Research Hermes model as its autonomous AI agent. All directives are escrowed and settled on pump.fun GO, making every payout verifiable on-chain.",
  },
];

export const stats = [
  { value: "10", label: "Directives issued" },
  { value: "6", label: "Open now" },
  { value: "16.50", label: "Escrowed rewards", suffix: "◎" },
];
