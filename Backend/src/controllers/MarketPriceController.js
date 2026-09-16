import MarketPrice from "../models/MarketPriceSchema.js";

// Controller to get the Market price
export const getMarketPrice = async(
    req,
    res
) =>{
    try{
        const prices = await MarketPrice.find()
                        .sort({
                            updatedAt  : -1,
                        });

        return res.status(200).json({
            success : true,
            count : prices.length,
            prices,
        });
    }catch(error){
        console.error(
            "Get Market prices error : ",
            error
        );

        return res.status(500).json({
            success : false,
            message : "Unable to load the market price."
        });
    }
}

// Controller for MarketPrice Search
export const searchMarketPrices =
    async (req, res) => {
        try {
            const { crop } = req.query;

            const filter = {};

            if (crop?.trim()) {
                filter.crop = {
                    $regex: crop.trim(),
                    $options: "i",
                };
            }

            const prices =
                await MarketPrice.find(
                    filter
                ).sort({
                    updatedAt: -1,
                });

            return res.status(200).json({
                success: true,
                count: prices.length,
                prices,
            });
        } catch (error) {
            console.error(
                "Search market prices error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Unable to search market prices.",
            });
        }
    };

    