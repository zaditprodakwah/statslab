# StatsLab R Research Script — Rasch Partial Credit Model (PCM) Analysis
# Requires: install.packages(c("TAM", "eRm"))

library(TAM)

cat("=== StatsLab Rasch PCM Analysis ===\n")

# Load data exported from /api/export/rasch
data_file <- "statslab-rasch-export.ctl"

if (file.exists(data_file)) {
  # Read CSV matrix (skipping Winsteps control header comments)
  data_raw <- read.csv(data_file, comment.char=";", header=FALSE)
  
  # Remove student name column (first column)
  responses <- data_raw[, -1]
  
  # Fit Partial Credit Model (PCM)
  mod <- tam.mml.2pl(resp = responses)
  
  cat("\n--- Summary of Item Parameters ---\n")
  print(summary(mod))
  
  # Item Fit Statistics (Infit / Outfit MNSQ)
  fit <- tam.fit(mod)
  cat("\n--- Item Fit Statistics (Infit/Outfit MNSQ) ---\n")
  print(fit$itemfit)
} else {
  cat("File 'statslab-rasch-export.ctl' not found. Export data from StatsLab Admin Panel first.\n")
}
