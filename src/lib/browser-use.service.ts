import { chromium } from "playwright";
import logger from "./logger";

/**
 * Browser-Use Service for Signhify AI
 * Provides browser automation capabilities for enhancing AI-generated products
 */
export class BrowserUseService {
  private browser: any = null;
  private context: any = null;
  private page: any = null;
  public isInitialized = false;

  /**
   * Initialize the browser service
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      this.browser = await chromium.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
        ],
      });

      this.context = await this.browser.newContext({
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
      });

      this.page = await this.context.newPage();

      // Set default timeout
      this.page.setDefaultTimeout(30000);

      this.isInitialized = true;
      logger.info("[BrowserUseService] Browser initialized successfully");
    } catch (error) {
      logger.error("[BrowserUseService] Failed to initialize browser:", error);
      throw error;
    }
  }

  /**
   * Close the browser and clean up resources
   */
  async cleanup() {
    if (!this.isInitialized) return;

    try {
      if (this.page) {
        await this.page.close();
      }
      if (this.context) {
        await this.context.close();
      }
      if (this.browser) {
        await this.browser.close();
      }

      this.isInitialized = false;
      logger.info("[BrowserUseService] Browser cleaned up successfully");
    } catch (error) {
      logger.error("[BrowserUseService] Error during cleanup:", error);
    }
  }

  /**
   * Navigate to a URL and wait for page load
   */
  async navigateTo(
    url: string,
    waitUntil: "load" | "domcontentloaded" | "networkidle" = "networkidle",
  ) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const response = await this.page.goto(url, { waitUntil });
      console.log(`[BrowserUseService] Navigated to ${url} - Status: ${response?.status()}`);
      return response;
    } catch (error) {
      console.error(`[BrowserUseService] Failed to navigate to ${url}:`, error);
      throw error;
    }
  }

  /**
   * Extract text content from the page using a CSS selector
   */
  async extractText(selector: string): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const element = await this.page.waitForSelector(selector, { timeout: 5000 });
      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }

      const text = await element.textContent();
      return text?.trim() || "";
    } catch (error) {
      console.error(`[BrowserUseService] Failed to extract text from ${selector}:`, error);
      throw error;
    }
  }

  /**
   * Extract attribute value from an element
   */
  async extractAttribute(selector: string, attributeName: string): Promise<string | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const element = await this.page.waitForSelector(selector, { timeout: 5000 });
      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }

      const attribute = await element.getAttribute(attributeName);
      return attribute;
    } catch (error) {
      console.error(
        `[BrowserUseService] Failed to extract attribute ${attributeName} from ${selector}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Take a screenshot of the page or specific element
   */
  async takeScreenshot(
    options: {
      path?: string;
      fullPage?: boolean;
      selector?: string;
      encoding?: "base64" | "binary";
    } = {},
  ): Promise<Buffer | string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const screenshotOptions: any = {
        path: options.path,
        fullPage: options.fullPage ?? false,
        encoding: options.encoding ?? "binary",
      };

      let buffer: Buffer;
      if (options.selector) {
        const element = await this.page.waitForSelector(options.selector, { timeout: 5000 });
        if (!element) {
          throw new Error(`Element not found for screenshot: ${options.selector}`);
        }
        buffer = await element.screenshot(screenshotOptions);
      } else {
        buffer = await this.page.screenshot(screenshotOptions);
      }

      return options.encoding === "base64" ? buffer.toString("base64") : buffer;
    } catch (error) {
      console.error("[BrowserUseService] Failed to take screenshot:", error);
      throw error;
    }
  }

  /**
   * Click an element by selector
   */
  async click(selector: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      await this.page.click(selector);
      console.log(`[BrowserUseService] Clicked element: ${selector}`);
    } catch (error) {
      console.error(`[BrowserUseService] Failed to click element ${selector}:`, error);
      throw error;
    }
  }

  /**
   * Type text into an input field
   */
  async typeText(selector: string, text: string, options: { delay?: number } = {}): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      await this.page.fill(selector, text);
      console.log(`[BrowserUseService] Typed text into: ${selector}`);
    } catch (error) {
      console.error(`[BrowserUseService] Failed to type text into ${selector}:`, error);
      throw error;
    }
  }

  /**
   * Wait for a specific condition or timeout
   */
  async waitFor(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Execute a custom function in the page context
   */
  async evaluate<T>(pageFunction: (page: any) => Promise<T> | T): Promise<T> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      return await this.page.evaluate(pageFunction);
    } catch (error) {
      console.error("[BrowserUseService] Failed to evaluate function in page context:", error);
      throw error;
    }
  }

  /**
   * Get all cookies
   */
  async getCookies(): Promise<any[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return await this.context.cookies();
  }

  /**
   * Set cookies
   */
  async setCookies(cookies: any[]): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    await this.context.addCookies(cookies);
  }

  /**
   * Validate a generated product URL by checking if it loads and contains expected content
   */
  async validateProductUrl(
    url: string,
    validationChecks: {
      titleContains?: string;
      elementExists?: string;
      textContains?: { selector: string; text: string }[];
      minLoadTime?: number;
    } = {},
  ): Promise<{
    success: boolean;
    loadTime: number;
    checks: Record<string, boolean>;
    errors: string[];
  }> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const startTime = Date.now();
    const errors: string[] = [];
    const checks: Record<string, boolean> = {};

    try {
      // Navigate to the URL
      const response = await this.page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      const loadTime = Date.now() - startTime;

      // Check HTTP status
      if (!response || response.status() >= 400) {
        errors.push(`HTTP ${response?.status()} - ${response?.statusText()}`);
      }

      // Check title if specified
      if (validationChecks.titleContains) {
        const title = await this.page.title();
        checks.titleContains = title.includes(validationChecks.titleContains);
        if (!checks.titleContains) {
          errors.push(
            `Title does not contain "${validationChecks.titleContains}". Actual: "${title}"`,
          );
        }
      }

      // Check if element exists
      if (validationChecks.elementExists) {
        try {
          await this.page.waitForSelector(validationChecks.elementExists, { timeout: 5000 });
          checks.elementExists = true;
        } catch (error) {
          checks.elementExists = false;
          errors.push(`Element not found: ${validationChecks.elementExists}`);
        }
      }

      // Check text content in elements
      if (validationChecks.textContains) {
        for (const check of validationChecks.textContains) {
          try {
            const element = await this.page.waitForSelector(check.selector, { timeout: 5000 });
            if (element) {
              const text = await element.textContent();
              checks[`text_${check.selector}`] = text?.includes(check.text) ?? false;
              if (!checks[`text_${check.selector}`]) {
                errors.push(
                  `Text "${check.text}" not found in element ${check.selector}. Actual: "${text?.trim()}"`,
                );
              }
            } else {
              checks[`text_${check.selector}`] = false;
              errors.push(`Element not found for text check: ${check.selector}`);
            }
          } catch (error) {
            checks[`text_${check.selector}`] = false;
            errors.push(
              `Failed to check text in ${check.selector}: ${error instanceof Error ? error.message : String(error)}`,
            );
          }
        }
      }

      // Check minimum load time
      if (validationChecks.minLoadTime) {
        checks.loadTimeAdequate = loadTime >= validationChecks.minLoadTime;
        if (!checks.loadTimeAdequate) {
          errors.push(
            `Page loaded too quickly: ${loadTime}ms (minimum: ${validationChecks.minLoadTime}ms)`,
          );
        }
      }

      const success = errors.length === 0;

      return {
        success,
        loadTime,
        checks,
        errors,
      };
    } catch (error) {
      const loadTime = Date.now() - startTime;
      errors.push(`Navigation failed: ${error instanceof Error ? error.message : String(error)}`);

      return {
        success: false,
        loadTime,
        checks: {},
        errors,
      };
    }
  }

  /**
   * Scrape structured data from a page using CSS selectors
   */
  async scrapeData<T extends Record<string, string>>(
    selectors: Record<string, string>,
  ): Promise<T> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const result: Record<string, string> = {};

    for (const [key, selector] of Object.entries(selectors)) {
      try {
        const element = await this.page.waitForSelector(selector, { timeout: 5000 });
        if (element) {
          const text = await element.textContent();
          result[key] = text?.trim() ?? "";
        } else {
          result[key] = "";
          console.warn(`[BrowserUseService] Selector not found for scraping: ${selector}`);
        }
      } catch (error) {
        result[key] = "";
        console.error(
          `[BrowserUseService] Failed to scrape data for key "${key}" with selector "${selector}":`,
          error,
        );
      }
    }

    return result as T;
  }
}

// Export a singleton instance
export const browserUseService = new BrowserUseService();
