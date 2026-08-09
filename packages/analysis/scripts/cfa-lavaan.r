# StatsLab R Research Script — Confirmatory Factor Analysis (CFA) via lavaan
# Requires: install.packages("lavaan")

library(lavaan)

cat("=== StatsLab Confirmatory Factor Analysis (CFA) ===\n")

data_file <- "statslab-cfa-export.csv"

if (file.exists(data_file)) {
  df <- read.csv(data_file)
  
  # Specify Single-Factor Model for Watson-Callingham Data Literacy
  cfa_model <- '
    LiterasiData =~ item_1 + item_2 + item_3 + item_4 + item_5 + item_6 + item_7 + item_8
  '
  
  fit <- cfa(cfa_model, data = df, ordered = c("item_1", "item_2", "item_3", "item_4", "item_5", "item_6", "item_7", "item_8"))
  
  cat("\n--- Fit Measures (CFI, TLI, RMSEA, SRMR) ---\n")
  print(summary(fit, fit.measures = TRUE, standardized = TRUE))
} else {
  cat("File 'statslab-cfa-export.csv' not found. Export data from StatsLab Admin Panel first.\n")
}
