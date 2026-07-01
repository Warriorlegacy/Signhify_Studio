// Example usage of the Product Validation Service
/*
IMPORTANT: This is an example file demonstrating how to use the product validation service.
It is not meant to be run directly in the application but to illustrate the capabilities.

To use this in production:
1. Import the productValidationService from '@/lib/product-validation.service'
2. Call validateProductFunctionality() to test a deployed product
3. Use validateAndEnhanceProduct() for a complete validation and enhancement cycle
*/

import { productValidationService } from "./product-validation.service";

/*
Example 1: Basic product validation
*/
async function exampleBasicValidation() {
  // Assuming you have a deployed product URL
  const productUrl = "https://example-product.signhify.app";

  try {
    const validationResult = await productValidationService.validateProductFunctionality(
      productUrl,
      "ecommerce store", // Specify product type for more tailored validation
    );

    console.log("Validation Results:");
    console.log(`- Success: ${validationResult.success}`);
    console.log(`- Score: ${validationResult.score}/100`);
    console.log(`- Load Time: ${validationResult.loadTime}ms`);
    console.log(`- Issues: ${validationResult.issues.join(", ") || "None"}`);
    console.log(`- Recommendations: ${validationResult.recommendations.join(", ") || "None"}`);

    return validationResult;
  } catch (error) {
    console.error("Validation failed:", error);
  }
}

/*
Example 2: Complete validation and enhancement cycle
*/
async function exampleValidationAndEnhancementCycle() {
  const productUrl = "https://example-product.signhify.app";

  try {
    const cycleResult = await productValidationService.validateAndEnhanceProduct(
      productUrl,
      "task management app",
      3, // Maximum 3 iterations of validate-enhance
    );

    console.log("Validation and Enhancement Cycle Results:");
    console.log(`- Overall Success: ${cycleResult.overallSuccess}`);
    console.log(`- Final URL: ${cycleResult.finalUrl}`);

    console.log("\nValidation Results by Iteration:");
    cycleResult.validationResults.forEach((result, index) => {
      console.log(`  Iteration ${index + 1}:`);
      console.log(`    - Success: ${result.success}`);
      console.log(`    - Score: ${result.score}/100`);
      console.log(`    - Issues: ${result.issues.length}`);
      console.log(`    - Load Time: ${result.loadTime}ms`);
    });

    console.log("\nEnhancement Results by Iteration:");
    cycleResult.enhancementResults.forEach((result, index) => {
      console.log(`  Iteration ${index + 1}:`);
      console.log(`    - Enhanced: ${result.enhanced}`);
      console.log(
        `    - Improvements: ${result.improvements.length} ${result.improvements.join(", ") || "none"}`,
      );
    });

    return cycleResult;
  } catch (error) {
    console.error("Validation and enhancement cycle failed:", error);
  }
}

/*
Example 3: Using with build functions
*/
async function exampleWithBuildFunctions() {
  // This would typically be done in a server function
  /*
  import { buildAndValidateProduct } from '@/lib/validate-and-enhance.functions';

  const result = await buildAndValidateProduct({
    prompt: "Create a gym management system with member tracking and class scheduling",
    planText: "Detailed plan from AI architect...",
    validate: true,
    enhance: false
  });

  // result.html contains the generated product
  // result.validation contains validation information
  */

  console.log("In a server function, you would:");
  console.log("1. Call buildAndValidateProduct to generate and validate a product");
  console.log("2. Return both the generated HTML and validation results");
  console.log("3. The frontend could display validation scores to users");
}

// Uncomment to run examples (in a Node.js environment with proper setup)
// exampleBasicValidation();
// exampleValidationAndEnhancementCycle();
// exampleWithBuildFunctions();

export { exampleBasicValidation, exampleValidationAndEnhancementCycle, exampleWithBuildFunctions };
