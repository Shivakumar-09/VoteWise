import { NextRequest, NextResponse } from "next/server";

interface EligibilityInput {
  age: number;
  citizenship: string;
  state: string;
  residencyMonths: number;
}

function checkEligibility(input: EligibilityInput) {
  const issues: string[] = [];
  const nextSteps: string[] = [];
  let eligible = true;

  // Age check
  if (input.age < 18) {
    eligible = false;
    issues.push(
      `You must be at least 18 years old to vote. You need to wait ${18 - input.age} more year(s).`
    );
  }

  // Citizenship check
  if (input.citizenship !== "indian") {
    eligible = false;
    issues.push(
      "Only Indian citizens are eligible to vote in Indian elections."
    );
  }

  // State check
  if (!input.state || input.state.trim() === "") {
    eligible = false;
    issues.push("You must be registered in an Indian state to vote.");
  }

  // Residency check
  if (input.residencyMonths < 1) {
    eligible = false;
    issues.push(
      "You must be an ordinary resident of your constituency. Recent arrivals may need to update their voter registration."
    );
  }

  if (eligible) {
    nextSteps.push("Visit https://voterportal.eci.gov.in to check if your name is in the electoral roll.");
    nextSteps.push("If not registered, fill Form 6 on the Voter Portal or at your nearest Electoral Registration Office.");
    nextSteps.push("Bring required documents: Aadhaar card, address proof, age proof.");
    nextSteps.push("You can also register via the Voter Helpline app or call 1950.");
  } else {
    if (input.age < 18) {
      nextSteps.push("You can pre-register at age 17 if you turn 18 before the qualifying date.");
    }
    if (input.citizenship !== "indian") {
      nextSteps.push("Learn about Indian citizenship: https://www.mha.gov.in/");
    }
    if (input.residencyMonths < 1) {
      nextSteps.push("Update your voter registration to your current address using Form 8A at voterportal.eci.gov.in.");
    }
  }

  return { eligible, issues, nextSteps };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { age, citizenship, state, residencyMonths } = body;

    if (typeof age !== "number" || age < 0 || age > 120) {
      return NextResponse.json({ error: "Invalid age" }, { status: 400 });
    }

    const result = checkEligibility({ age, citizenship, state, residencyMonths });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Eligibility check error:", error);
    return NextResponse.json(
      { error: "Failed to check eligibility" },
      { status: 500 }
    );
  }
}
