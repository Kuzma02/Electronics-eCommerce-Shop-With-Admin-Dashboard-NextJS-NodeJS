const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function uploadMainImage(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Nema otpremljenih fajlova" });
    }
  
    // Uzmi fajl iz zahteva
    const uploadedFile = req.files.uploadedFile;
  
    // Koristi mv() metodu za pomeranje fajla u odgovarajući direktorijum na serveru
    uploadedFile.mv('../public/' + uploadedFile.name, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
  
      res.status(200).json({ message: "Fajl je uspešno otpremljen" });
    });
  }

  module.exports = {
    uploadMainImage
};