import { browserUseService } from "./browser-use.service";

/**
 * Product Validation and Enhancement Service
 * Uses browser automation to validate and improve generated products
 */
export class ProductValidationService {
  /**
   * Validate a generated product URL by testing its functionality
   * Uses existing validateProductUrl method from browser-use service when possible
   */
  async validateProductFunctionality(
    url: string,
    productType: string = "web app"
  ): Promise<{
    success: boolean;
    score: number; // 0-100
    issues: string[];
    recommendations: string[];
    loadTime: number;
  }> {
    try {
      console.log(`[ProductValidationService] Starting validation for ${url}`);

      // Initialize browser if needed
      if (!browserUseService.isInitialized) {
        await browserUseService.initialize();
      }

      // Use the existing validateProductUrl method for basic validation
      // Then add additional checks
      const validationChecks = {
        // Add some basic checks based on product type
        titleContains: productType.charAt(0).toUpperCase() + productType.slice(1),
        elementExists: "body", // Basic check that body exists
        textContains: [
          { selector: "h1, h2, h3", text: productType.charAt(0).toUpperCase() + productType.slice(1) }
        ],
        minLoadTime: 1000 // At least 1 second to consider it a real load
      };

      const startTime = Date.now();
      const validationResult = await browserUseService.validateProductUrl(url, validationChecks);
      const loadTime = Date.now() - startTime;

      // Extract results from the validation
      const { success, loadTime: validationLoadTime, checks, errors } = validationResult;

      // Convert validation checks to issues and recommendations
      const issues: string[] = [...errors];
      const recommendations: string[] = [];

      // Add recommendations based on failed checks
      if (checks.titleContains === false) {
        recommendations.push(`Consider adding a title that includes "${productType}"`);
      }

      if (checks.elementExists === false) {
        issues.push("Basic HTML structure missing (body element not found)");
      }

      // Check text content results
      for (const [key, value] of Object.entries(checks)) {
        if (key.startsWith("text_") && value === false) {
          const selector = key.substring(5); // Remove "text_" prefix
          recommendations.push(`Consider adding text content matching your product type in ${selector}`);
        }
      }

      if (!checks.loadTimeAdequate) {
        recommendations.push(`Consider optimizing load time (current: ${validationLoadTime}ms)`);
      }

      // Calculate score based on validation results
      let score = success ? 85 : 45; // Base score on whether basic validation passed

      // Adjust score based on specific check results
      const totalChecks = Object.keys(checks).length;
      let passedChecks = 0;
      for (const value of Object.values(checks)) {
        if (value === true) passedChecks++;
      }

      // Add points for passed checks (up to 15 points)
      score += Math.round((passedChecks / totalChecks) * 15);

      // Bonus for good load time
      if (validationLoadTime < 2000) {
        score += 5; // Fast load time bonus
      } else if (validationLoadTime > 5000) {
        score -= 5; // Slow load time penalty
      }

      // Ensure score is between 0 and 100
      score = Math.max(0, Math.min(100, score));

      // Success is true if score is good enough and no critical issues
      const criticalIssues = issues.filter(issue =>
        issue.includes("HTTP") ||
        issue.includes("missing") ||
        issue.includes("failed")
      );
      const finalSuccess = score >= 70 && criticalIssues.length === 0;

      console.log(`[ProductValidationService] Validation complete. Score: ${score}, Success: ${finalSuccess}`);

      return {
        success: finalSuccess,
        score,
        issues,
        recommendations: [
          ...recommendations,
          ...(score < 80 ? ["Consider improving overall polish and user experience"] : []),
          ...(score < 60 ? ["Significant improvements needed for production readiness"] : [])
        ],
        loadTime: validationLoadTime
      };
    } catch (error) {
      console.error(`[ProductValidationService] Validation failed:`, error);
      return {
        success: false,
        score: 0,
        issues: [`Validation failed: ${error instanceof Error ? error.message : String(error)}`],
        recommendations: ["Fix critical errors before attempting validation"],
        loadTime: 0
      };
    }
  }

  /**
   * Enhance a generated product based on validation results
   * Attempts to make improvements via browser automation
   */
  async enhanceProductBasedOnValidation(
    url: string,
    validationResult: {
      success: boolean;
      score: number;
      issues: string[];
      recommendations: string[];
    }
  ): Promise<{
    enhanced: boolean;
    improvements: string[];
  }> {
    try {
      console.log(`[ProductValidationService] Starting enhancement for ${url}`);

      // Initialize browser if needed
      if (!browserUseService.isInitialized) {
        await browserUseService.initialize();
      }

      // Navigate to the product URL
      await browserUseService.navigateTo(url, "networkidle");

      const improvements: string[] = [];

      // Based on validation results, attempt to make improvements
      if (validationResult.score < 80) {
        // Try to improve basic styling using evaluate
        try {
          await browserUseService.evaluate(async (page) => {
            await page.addStyleTag({
              content: `
                /* Enhanced styling for better UX */
                button:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 4px 12px rgba(255, 106, 0, 0.3);
                  transition: all 0.2s ease;
                }
                input, textarea, select {
                  border-radius: 0.375rem;
                  border: 1px solid #333;
                  background-color: #1a1a1a;
                  color: white;
                  padding: 0.75rem;
                }
                input:focus, textarea:focus, select:focus {
                  outline: 2px solid #ff6a00;
                  border-color: #ff6a00;
                }
              `
            });
          });
          improvements.push("Added enhanced hover and focus states");
        } catch (error) {
          console.warn("[ProductValidationService] Failed to add style enhancements:", error);
        }
      }

      // If missing interactive elements, we can't really add them via browser automation
      // but we can note what's missing
      if (validationResult.recommendations && validationResult.recommendations.some(r => r.includes("interactive elements"))) {
        improvements.push("Identified need for more interactive elements (requires code changes)");
      }

      // If accessibility issues, try to add basic attributes
      if (validationResult.recommendations && validationResult.recommendations.some(r => r.includes("lang attribute"))) {
        try {
          await browserUseService.evaluate(async (page) => {
            await page.evaluate(() => {
              document.documentElement.lang = "en";
            });
          });
          improvements.push("Added lang attribute for accessibility");
        } catch (error) {
          console.warn("[ProductValidationService] Failed to add lang attribute:", error);
        }
      }

      const enhanced = improvements.length > 0;

      console.log(`[ProductValidationService] Enhancement complete. Made ${improvements.length} improvements.`);

      return {
        enhanced,
        improvements
      };
    } catch (error) {
      console.error(`[ProductValidationService] Enhancement failed:`, error);
      return {
        enhanced: false,
        improvements: []
      };
    }
  }

  /**
   * Run a complete validation and enhancement cycle
   * Note: For security reasons, this service cannot permanently modify deployed products.
   * In a production environment, this would:
   * 1. Validate the deployed product
   * 2. Generate improvement suggestions
   * 3. Feed those suggestions back to the AI for code improvement
   * 4. Redeploy the improved product
   */
  async validateAndEnhanceProduct(
    url: string,
    productType: string = "web app",
    maxIterations: number = 3
  ): Promise<{
    finalUrl: string;
    validationResults: Array<{
      success: boolean;
      score: number;
      issues: string[];
      recommendations: string[];
      loadTime: number;
    }>;
    enhancementResults: Array<{
      enhanced: boolean;
      improvements: string[];
    }>;
    overallSuccess: boolean;
    improvementSuggestions: string[];
  }> {
    try {
      console.log(`[ProductValidationService] Starting validation and enhancement cycle for ${url}`);

      const validationResults: Array<{
        success: boolean;
        score: number;
        issues: string[];
        recommendations: string[];
        loadTime: number;
      }> = [];

      const enhancementResults: Array<{
        enhanced: boolean;
        improvements: string[];
      }> = [];

      let currentUrl = url;
      let overallSuccess = false;
      const allImprovementSuggestions: string[] = [];

      for (let i = 0; i < maxIterations; i++) {
        console.log(`[ProductValidationService] Iteration ${i + 1}/${maxIterations}`);

        // Validate current state
        const validationResult = await this.validateProductFunctionality(currentUrl, productType);
        validationResults.push(validationResult);

        // Collect improvement suggestions
        if (validationResult.recommendations && validationResult.recommendations.length > 0) {
          allImprovementSuggestions.push(...validationResult.recommendations);
        }

        // If validation is successful, we're done
        if (validationResult.success && validationResult.score >= 80) {
          overallSuccess = true;
          break;
        }

        // Otherwise, try to enhance (in browser only - temporary changes)
        const enhancementResult = await this.enhanceProductBasedOnValidation(currentUrl, validationResult);
        enhancementResults.push(enhancementResult);

        // Note: In a real implementation, we would need to redeploy the enhanced product
        // For now, we'll just continue with the same URL since browser enhancements are temporary
        // A production implementation would save the enhanced code and redeploy
      }

      // Final validation
      const finalValidation = await this.validateProductFunctionality(currentUrl, productType);
      validationResults.push(finalValidation);

      overallSuccess = finalValidation.success && finalValidation.score >= 70;

      console.log(`[ProductValidationService] Validation and enhancement cycle complete. Overall success: ${overallSuccess}`);

      return {
        finalUrl: currentUrl,
        validationResults,
        enhancementResults,
        overallSuccess,
        improvementSuggestions: Array.from(new Set(allImprovementSuggestions)) // Remove duplicates
      };
    } catch (error) {
      console.error(`[ProductValidationService] Validation and enhancement cycle failed:`, error);
      return {
        finalUrl: url,
        validationResults: [{
          success: false,
          score: 0,
          issues: [`Cycle failed: ${error instanceof Error ? error.message : String(error)}`],
          recommendations: ["Fix critical errors"],
          loadTime: 0
        }],
        enhancementResults: [{
          enhanced: false,
          improvements: []
        }],
        overallSuccess: false,
        improvementSuggestions: ["Fix critical errors before attempting validation"]
      };
    }
  }
}

// Export a singleton instance
export const productValidationService = new ProductValidationService();