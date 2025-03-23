app.post("/save-data", async (req, res) => {
  try {
    const { educationLevel, categories } = req.body;

    const educationValues = { kindergarten: false, elementary: false, middle: false, high: false };
    const categoryValues = { art: false, business: false, english: false, french: false, math: false, music: false, science: false, social_sciences: false };

    if (educationLevel in educationValues) {
      educationValues[educationLevel] = true;
    }

    categories.forEach(category => {
      if (category in categoryValues) {
        categoryValues[category] = true;
      }
    });

    await pool.query(
      `INSERT INTO user_education (kindergarten, elementary, middle, high) 
       VALUES ($1, $2, $3, $4)`,
      Object.values(educationValues)
    );

    await pool.query(
      `INSERT INTO user_learning_categories (art, business, english, french, math, music, science, social_sciences) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      Object.values(categoryValues)
    );

    res.json({ message: "Data saved successfully!" });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving data");
  }
});
