const express = require("express");
const router = express.Router();
const dataInstrument = require("./instruments.json");
const path = require("path");
const { query, validationResult, body } = require("express-validator");
const fs = require("fs");


//Filtar por rango de valores.
router.get("/list", (req, res) => {
  let limit = req.query.limit;
  let from = req.query.from;
  if (from < 0 && limit < 0) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (limit >= dataInstrument.instruments.length) {
    limit = dataInstrument.instruments.length;
    from = limit - 3;
  }
  res.status(200).json(dataInstrument.instruments.slice(from, limit));
});

//Obtener objeto por ID.
router.get("/instrument/:title", (req, res) => {
  const elem = dataInstrument.instruments.find(
    (value) => value.titulo === req.params.title
  ); //usar find(Hecho)
  if (!elem.isEmpty) {
    res.json(elem);
    console.log(elem);
  } else {
    res.status(404).json({
      msg: `404 No existe el instrumento solicitado ${req.query.instrumentTitle}`,
    });
  }
});

router.post("/instruments",
  [
    body("textoDeFondo").notEmpty(),
    body("titulo").notEmpty(),
    body("fecha").notEmpty(),
    body("descripcion").notEmpty(),
    body("boton").notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    console.log(req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newInstrumentValue = {
      textoDeFondo: `${req.body.textoDeFondo}`,
      titulo: `${req.body.titulo}`,
      fecha: `${req.body.fecha}`,
      descripcion: `${req.body.descripcion}`,
      boton: `${req.body.boton}`,
    };

    dataInstrument.instruments.push(newInstrumentValue);

    try {
      fs.writeFileSync("./instruments.json", JSON.stringify(dataInstrument));
    } catch (err) {
      res.send.status(500); //tirar un 500(Hecho)
      console.log(err);
    }

    res.json(newInstrumentValue);
  }
);

module.exports = router;
