exports.calculateHoldVsSell = (req, res) => {
  try {
    const { 
      cropName, 
      currentPricePerKg, 
      amountKg, 
      daysToHold, 
      dailyStorageCostPerKg, 
      spoilageRiskPercentage 
    } = req.body;

    // a) Profit if sold today
    const profitIfSoldToday = currentPricePerKg * amountKg;

    // b) Generate a fake "Predicted Future Price" (2-8% increase)
    const randomIncreasePercentage = (Math.random() * (8 - 2) + 2) / 100;
    const predictedFuturePrice = currentPricePerKg * (1 + randomIncreasePercentage);

    // c) Calculate Storage Cost
    const storageCost = amountKg * dailyStorageCostPerKg * daysToHold;

    // d) Calculate Spoilage Loss (based on future expected price of the spoiled crops)
    const spoilageLoss = (amountKg * (spoilageRiskPercentage / 100)) * predictedFuturePrice;

    // e) Profit if held
    const profitIfHeld = (predictedFuturePrice * amountKg) - storageCost - spoilageLoss;

    // Recommend Holding check
    const recommendHolding = profitIfHeld > profitIfSoldToday;

    res.status(200).json({
      cropName,
      profitIfSoldToday,
      predictedFuturePrice,
      storageCost,
      spoilageLoss,
      profitIfHeld,
      recommendHolding,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
