const handleImage = (req, res, stub, metadata) => {
    console.log(req.body.imageURL)
    stub.PostModelOutputs(
        {
            // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
            model_id: "a403429f2ddf4b49b307e318f00e528b",
            inputs: [{ data: { image: { url: `${req.body.imageURL}` } } }]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                return;
            }
            
            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return;
            }
            // .outputs[0].data.regions[0].region_info.bounding_box 
            res.json(response.outputs[0].data.regions[0].region_info.bounding_box);
        }
    );
}


module.exports = {
    handleImage: handleImage
};