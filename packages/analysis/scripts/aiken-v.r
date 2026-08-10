# aiken-v.r
# Menghitung Content Validity Index (Aiken's V) untuk instrumen StatsLab

# Rumus Aiken's V: V = \Sigma s / [n * (c - 1)]
# s = r - lo (r = skor pakar, lo = skor terendah)
# n = jumlah pakar
# c = jumlah pilihan skor (misal: 1 sampai 5, maka c = 5)

calculate_aiken_v <- function(scores, min_score=1, max_score=5) {
  n <- length(scores)
  c <- max_score - min_score + 1
  s_total <- sum(scores - min_score)
  v <- s_total / (n * (c - 1))
  return(v)
}

# Contoh penggunaan:
# Misal ada 5 pakar menilai Item 1 dengan skor: 4, 5, 4, 5, 4
skor_item_1 <- c(4, 5, 4, 5, 4)
v_item_1 <- calculate_aiken_v(skor_item_1)

cat("Skor Pakar:", skor_item_1, "\n")
cat("Nilai Aiken's V:", v_item_1, "\n")

if (v_item_1 > 0.8) {
  cat("Kesimpulan: Item Valid (High Validity)\n")
} else {
  cat("Kesimpulan: Item Perlu Direvisi\n")
}
