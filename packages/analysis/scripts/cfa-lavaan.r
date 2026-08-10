# StatsLab R Research Script — Confirmatory Factor Analysis (CFA) via lavaan
# Requires: install.packages("lavaan")
#
# Input: CSV yang diekspor dari Admin Panel (/api/export/cfa),
#        pola nama file: statslab-cfa-lisrel-*.csv
# Item diambil dinamis dari header kolom (item_1 ... item_N).

library(lavaan)

cat("=== StatsLab Confirmatory Factor Analysis (CFA) ===\n")

data_file <- list.files(pattern = "^statslab-cfa-lisrel-.*\\.csv$", full.names = TRUE)
data_file <- data_file[order(data_file, decreasing = TRUE)][1]

if (!is.na(data_file)) {
  cat("Menggunakan file:", data_file, "\n")
  df <- read.csv(data_file, stringsAsFactors = FALSE)

  # Kolom item: semua kolom bernama item_*
  item_cols <- grep("^item_", names(df), value = TRUE)
  if (length(item_cols) == 0) {
    cat("Tidak ditemukan kolom item_* pada file ekspor.\n")
    quit(status = 1)
  }
  cat("Jumlah item:", length(item_cols), "\n")

  # Spesifikasi model faktor tunggal "Literasi Data" Watson-Callingham
  cfa_model <- paste0(
    "LiterasiData =~ ",
    paste(item_cols, collapse = " + ")
  )

  fit <- cfa(cfa_model, data = df, ordered = item_cols)

  cat("\n--- Fit Measures (CFI, TLI, RMSEA, SRMR) ---\n")
  print(summary(fit, fit.measures = TRUE, standardized = TRUE))
} else {
  cat("File 'statslab-cfa-lisrel-*.csv' tidak ditemukan. Ekspor data dari Admin Panel dulu.\n")
}
