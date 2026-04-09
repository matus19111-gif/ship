import config from "@/config";
import ButtonCheckout from "./ButtonCheckout";

// <Pricing/> displays the pricing plans for your app
// Plans: Monthly $19, Yearly $179, Lifetime $249 (early adopters)

const Pricing = () => {
  // Define plans directly or you can still use config.stripe.plans
  const plans = [
    {
      name: "Monthly",
      price: 19,
      priceId: "price_monthly_id", // Replace with your Stripe price ID
      description: "Perfect for getting started",
      features: [
        { name: "Full access to all features" },
        { name: "Monthly updates" },
        { name: "Email support" },
        { name: "Cancel anytime" }
      ]
    },
    {
      name: "Yearly",
      price: 179,
      priceId: "price_yearly_id", // Replace with your Stripe price ID
      description: "Best value - Save $49/year",
      isFeatured: true,
      features: [
        { name: "Everything in Monthly" },
        { name: "Save $49 compared to monthly" },
        { name: "Priority email support" },
        { name: "Annual billing" }
      ]
    },
    {
      name: "Lifetime",
      price: 249,
      priceId: "price_lifetime_id", // Replace with your Stripe price ID
      description: "Early adopter special - Limited time",
      features: [
        { name: "Everything in Yearly" },
        { name: "One-time payment" },
        { name: "Lifetime access forever" },
        { name: "All future updates included" },
        { name: "Premium support" }
      ]
    }
  ];

  return (
    <section className="bg-base-200 overflow-hidden" id="pricing">
      <div className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <p className="font-medium text-primary mb-8">Simple, Transparent Pricing</p>
          <h2 className="font-bold text-3xl lg:text-5xl tracking-tight">
            Choose the plan that's right for you
          </h2>
          <p className="text-lg text-base-content/80 mt-4 max-w-2xl mx-auto">
            No hidden fees. Cancel anytime. Start building today.
          </p>
        </div>

        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {plans.map((plan) => (
            <div key={plan.priceId} className="relative w-full max-w-md">
              {plan.isFeatured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <span
                    className={`badge text-xs text-primary-content font-semibold border-0 bg-primary`}
                  >
                    BEST VALUE
                  </span>
                </div>
              )}

              {plan.isFeatured && (
                <div
                  className={`absolute -inset-[1px] rounded-[9px] bg-primary z-10`}
                ></div>
              )}

              <div className="relative flex flex-col h-full gap-5 lg:gap-8 z-10 bg-base-100 p-8 rounded-lg">
                <div>
                  <p className="text-2xl lg:text-3xl font-bold">{plan.name}</p>
                  {plan.description && (
                    <p className="text-base-content/80 mt-2 text-sm">
                      {plan.description}
                    </p>
                  )}
                </div>

                <div className="flex items-baseline gap-1">
                  <p className="text-5xl tracking-tight font-extrabold">
                    ${plan.price}
                  </p>
                  <div className="flex flex-col">
                    <p className="text-xs text-base-content/60 uppercase font-semibold">
                      USD
                    </p>
                    {plan.name === "Monthly" && (
                      <p className="text-xs text-base-content/60">/month</p>
                    )}
                    {plan.name === "Yearly" && (
                      <p className="text-xs text-base-content/60">/year</p>
                    )}
                    {plan.name === "Lifetime" && (
                      <p className="text-xs text-base-content/60">one-time</p>
                    )}
                  </div>
                </div>

                {plan.name === "Yearly" && (
                  <p className="text-sm text-green-600 font-semibold -mt-2">
                    Save $49 compared to monthly billing
                  </p>
                )}

                {plan.name === "Lifetime" && (
                  <p className="text-sm text-orange-600 font-semibold -mt-2">
                    🎉 Early adopter special - Limited spots
                  </p>
                )}

                {plan.features && (
                  <ul className="space-y-2.5 leading-relaxed text-base flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-[18px] h-[18px] opacity-80 shrink-0 text-primary"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="space-y-3">
                  <ButtonCheckout priceId={plan.priceId} />
                  
                  {plan.name === "Monthly" && (
                    <p className="flex items-center justify-center gap-2 text-sm text-center text-base-content/60">
                      Cancel anytime • No contracts
                    </p>
                  )}
                  {plan.name === "Yearly" && (
                    <p className="flex items-center justify-center gap-2 text-sm text-center text-base-content/60">
                      30-day money-back guarantee
                    </p>
                  )}
                  {plan.name === "Lifetime" && (
                    <p className="flex items-center justify-center gap-2 text-sm text-center text-base-content/60">
                      Pay once • Access forever
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
