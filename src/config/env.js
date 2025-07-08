/**
 * Environment Variables Configuration
 *
 * Validates and exports environment variables for the application
 * Provides fallback values and runtime validation
 */

const requiredEnvVars = ["VITE_API_BASE_URL"];

const envConfig = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  NODE_ENV: import.meta.env.NODE_ENV || "development",
  DEV: import.meta.env.DEV || false,
  PROD: import.meta.env.PROD || false,
};

// Validate required environment variables
const validateEnvVars = () => {
  const missingVars = requiredEnvVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    console.error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
    if (envConfig.PROD) {
      throw new Error("Missing required environment variables");
    }
  }
};

// Validate on load
validateEnvVars();

export default envConfig;
