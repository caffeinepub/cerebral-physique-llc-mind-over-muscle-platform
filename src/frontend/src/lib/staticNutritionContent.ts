import type { NutritionArticle, NutritionArticlePreview } from "../backend";

// Static nutrition articles - always visible regardless of backend state
// Using negative IDs to avoid collision with backend-assigned IDs

export const STATIC_NUTRITION_ARTICLES: NutritionArticle[] = [
  {
    id: BigInt(-1),
    title: "Performance Nutrition: Fueling Your Body for Maximum Results",
    content: `Nutrition is the substrate on which all physical adaptation is built. No training program — regardless of sophistication — can overcome a chronic energy deficit, inadequate protein intake, or persistent micronutrient gaps. Performance nutrition is not about perfection. It is about consistency, timing, and prioritization of the variables with the largest effect sizes.

This article is grounded in current evidence from the American College of Sports Medicine, the Academy of Nutrition and Dietetics, Harvard T.H. Chan School of Public Health, and peer-reviewed sports nutrition research as of 2024.

THE PERFORMANCE PLATE: MACRONUTRIENT DISTRIBUTION

For physically active adults training 4-6 days per week at moderate-to-high intensity, a starting macronutrient framework is:

- Protein: 1.6–2.2 g per kilogram of bodyweight per day
- Carbohydrates: 3–6 g per kilogram of bodyweight per day (scale higher with training volume)
- Fats: 0.8–1.2 g per kilogram of bodyweight per day

These ranges, supported by a 2017 meta-analysis in the British Journal of Sports Medicine (Morton et al.), represent the evidence-based consensus for muscle protein synthesis optimization and energy availability. Higher protein intakes (>2.2g/kg/day) show diminishing returns for most individuals without pharmacological support.

Harvard's Healthy Eating Plate, developed by nutrition scientists at the Harvard T.H. Chan School of Public Health, provides a practical visual framework: half the plate consisting of colorful vegetables and fruits, a quarter from whole grains, and a quarter from lean protein sources. This structure naturally produces adequate fiber intake (25-38g/day), which supports gut microbiome health — an increasingly recognized factor in athletic recovery and immune function.

PROTEIN: THE FOUNDATION OF MUSCLE ADAPTATION

Protein synthesis and protein breakdown occur continuously. Net muscle gain requires that synthesis exceeds breakdown — a state facilitated by resistance training stimulus and adequate dietary protein.

Key research findings:

1. Distribution matters as much as total intake. Four to five protein servings of 20-40g distributed across the day produce greater muscle protein synthesis than the same total consumed in fewer, larger doses. This is established by research from Stuart Phillips (McMaster University) and colleagues, published in the American Journal of Clinical Nutrition.

2. Leucine threshold: Muscle protein synthesis requires a minimum leucine dose (~2-3g per meal) to trigger maximal activation of the mTOR signaling pathway. Animal proteins (whey, eggs, beef, fish, chicken) reach this threshold easily. Plant proteins generally require larger serving sizes to achieve equivalent leucine delivery.

3. Pre-sleep protein: A 40g dose of casein protein consumed 30-60 minutes before sleep has been shown to increase overnight muscle protein synthesis by approximately 22% (Res et al., 2012, Medicine & Science in Sports & Exercise). This is particularly relevant for athletes training in the evening.

High-quality protein sources to prioritize:
- Greek yogurt (18-20g per cup)
- Eggs (6g per large egg, complete amino acid profile)
- Chicken breast (31g per 100g cooked)
- Canned wild-caught salmon (25g per 100g)
- Legumes (15-18g per cooked cup, complementary with grains for complete profile)
- Cottage cheese (25g per cup, high casein)

CARBOHYDRATES: THE PRIMARY FUEL FOR HIGH-INTENSITY EFFORT

Despite their controversial reputation in popular culture, carbohydrates remain the dominant fuel for exercise above 60% of VO2 max — which describes most resistance training and interval-based cardio. Glycogen depletion is a primary limiter of training volume and intensity.

The type of carbohydrate matters:

- Whole grains (oats, brown rice, quinoa, barley) produce a lower and more sustained glycemic response than refined grains. The fiber matrix slows digestion and reduces insulin spikes, preserving blood glucose stability across a training session.
- Refined carbohydrates are most appropriate in the 30-minute peri-workout window, where rapid gastric emptying and glucose availability are the priority.

Muscle glycogen resynthesis is fastest within 30-60 minutes post-exercise (the "glycogen window"), when GLUT4 transporter expression on muscle cells is elevated. Consuming 0.5-0.7g of carbohydrate per kilogram of bodyweight in this window meaningfully accelerates recovery — especially relevant for athletes training more than once per day.

FATS: HORMONAL HEALTH, INFLAMMATION, AND LONGEVITY

Dietary fat is essential for hormone synthesis, fat-soluble vitamin absorption (A, D, E, K), cell membrane integrity, and regulation of systemic inflammation.

Omega-3 fatty acids (EPA and DHA) deserve particular attention for active individuals. Multiple randomized controlled trials have demonstrated that omega-3 supplementation (2-4g EPA+DHA per day) reduces exercise-induced muscle damage, decreases inflammatory markers (CRP, IL-6), and may enhance muscle protein synthesis in older athletes. Excellent dietary sources include fatty fish (wild-caught salmon, mackerel, sardines) and algae-derived omega-3 supplements for those avoiding fish.

Saturated fat should be moderated (below 10% of total calories) as a cardiovascular risk management strategy. Replace saturated fat sources with monounsaturated fats (olive oil, avocado, nuts) where possible — this substitution is associated with a 15-30% reduction in cardiovascular disease risk in large observational studies.

Avoid trans fats entirely. There is no safe intake level, and they are now banned from the US food supply. Check ingredient labels for "partially hydrogenated oils" in imported or processed foods.

HYDRATION: THE MOST UNDERRATED PERFORMANCE VARIABLE

A body water deficit of just 2% of bodyweight has been shown to impair exercise performance, reduce strength output, decrease aerobic capacity, and impair cognitive function. Most people begin exercise in a mild state of dehydration.

General hydration guidelines for active adults (American College of Sports Medicine, 2016):

- Pre-exercise: 500ml (17oz) of water 2 hours before training
- During exercise: 150-250ml (5-8oz) every 15-20 minutes
- Post-exercise: 1.5L for every 1kg of bodyweight lost to sweat

Electrolytes — particularly sodium, potassium, and magnesium — are lost through sweat and must be replaced during sessions lasting more than 60-90 minutes. Sports drinks, electrolyte tablets, or whole food sources (bananas, avocado, salted nuts) serve this function. Hyponatremia (low blood sodium) from overhydration with plain water is a documented risk in endurance athletes and should be taken seriously.

PRE-WORKOUT NUTRITION

The optimal pre-workout meal, consumed 2-4 hours before training:
- 1-4g carbohydrate per kg bodyweight
- 0.15-0.25g protein per kg bodyweight
- Low fat (delays gastric emptying)
- Low fiber immediately before training (gastrointestinal comfort)

Examples: oats with protein powder and banana; rice and chicken; whole grain toast with eggs.

For those training early in the morning (within 1 hour of waking), a smaller, rapidly absorbed option is appropriate: 20-30g whey protein, 30-40g fast-digesting carbohydrates (banana, white rice, sports drink), minimal fat.

POST-WORKOUT NUTRITION

The post-workout window is real, but its urgency has been somewhat overstated in fitness culture. Current evidence suggests that total daily protein and carbohydrate intake matters more than precise timing for most recreational athletes. That said, consuming a mixed protein-and-carbohydrate meal within 2 hours of training is a reliable best practice.

Target post-workout intake:
- Protein: 20-40g (leucine-rich)
- Carbohydrates: 1-1.5g per kg bodyweight
- Fluids: begin rehydration immediately

ESSENTIAL MICRONUTRIENTS FOR ACTIVE ADULTS

Vitamin D: Deficiency is prevalent globally (estimated 40% of the US population is deficient). Vitamin D supports calcium absorption for bone density, testosterone synthesis, immune function, and inflammatory regulation. Testing (serum 25-OH vitamin D) is the only reliable way to assess status. Target: 40-60 ng/mL. Source: sun exposure, fatty fish, fortified foods, supplementation.

Magnesium: Involved in over 300 enzymatic reactions, including ATP production, muscle contraction, and sleep quality. Athletes deplete magnesium through sweat at a higher rate than sedentary individuals. Dietary sources: dark leafy greens, pumpkin seeds, dark chocolate, legumes.

Iron: Critical for oxygen transport and energy metabolism. Female athletes and endurance athletes are at elevated risk for depletion. Symptoms of insufficiency include fatigue, decreased aerobic capacity, and impaired recovery. Absorption is enhanced by vitamin C and inhibited by calcium and tannins (tea, coffee). Obtain iron levels via serum ferritin testing.

CONCLUSION

Performance nutrition is not a complex puzzle to be solved once. It is a dynamic system to be managed continuously as training demands, life circumstances, and body composition goals evolve. The principles are consistent: adequate total energy, sufficient and distributed protein, strategically timed carbohydrates, quality fats, rigorous hydration, and attention to micronutrient gaps.

Every adaptation you pursue in training — muscle growth, fat loss, strength, endurance — is ultimately processed through the nutritional environment you create. Fuel precisely. Recover deliberately. Perform optimally.`,
    author: "Cerebral Physique LLC",
    published: true,
    memberOnly: false,
    createdAt: BigInt(1743120000000000000),
    media: { imageUrls: [], videoUrls: [] },
  },
];

export const STATIC_NUTRITION_ARTICLE_PREVIEWS: NutritionArticlePreview[] =
  STATIC_NUTRITION_ARTICLES.map((a) => ({
    id: a.id,
    title: a.title,
    createdAt: a.createdAt,
    author: a.author,
    memberOnly: a.memberOnly,
  }));

export function getStaticNutritionArticle(id: bigint): NutritionArticle | null {
  return STATIC_NUTRITION_ARTICLES.find((a) => a.id === id) ?? null;
}
