# StatsLab R Research Script — Rasch Partial Credit Model (PCM) Analysis
# Requires: install.packages(c("TAM", "eRm"))
#
# Input: control file Winsteps yang diekspor dari Admin Panel (/api/export/rasch),
#        pola nama file: statslab-rasch-winsteps-*.ctl
# Jumlah item dibaca dinamis dari header NI pada control file.

library(TAM)

cat("=== StatsLab Rasch PCM Analysis ===\n")

data_file <- list.files(pattern = "^statslab-rasch-winsteps-.*\\.ctl$", full.names = TRUE)
data_file <- data_file[order(data_file, decreasing = TRUE)][1]

if (!is.na(data_file)) {
  cat("Menggunakan file:", data_file, "\n")

  # Baca control file sebagai teks untuk mengekstrak NI
  ctl_lines <- readLines(data_file)
  ni_line <- grep("^NI\\s*=", ctl_lines, value = TRUE)
  ni <- if (length(ni_line) > 0) as.integer(sub(".*=\\s*", "", ni_line[1])) else NA

  # Baca matriks CSV (mengabaikan komentar Winsteps ';' dan baris header)
  data_raw <- read.csv(data_file, comment.char = ";", header = FALSE)

  # Kolom pertama adalah nama siswa; sisanya respons
  responses <- data_raw[, -1, drop = FALSE]

  if (is.na(ni)) ni <- ncol(responses)
  cat("Jumlah item (NI):", ni, "\n")

  # Fit Partial Credit Model (PCM)
  mod <- tam.mml.2pl(resp = responses)

  cat("\n--- Summary of Item Parameters ---\n")
  print(summary(mod))

  # Item Fit Statistics (Infit / Outfit MNSQ)
  fit <- tam.fit(mod)
  cat("\n--- Item Fit Statistics (Infit/Outfit MNSQ) ---\n")
  print(fit$itemfit)
} else {
  cat("File 'statslab-rasch-winsteps-*.ctl' tidak ditemukan. Ekspor data dari Admin Panel dulu.\n")
}
