const router             = require('express').Router();
const axios              = require('axios');
const secure             = require('./secure');
// todo create route to selective downloads (ex:  42, 43, 50)

router.get('/', secure.required, (req, res, next) => {
    const countFrom = req.query.countFrom - 1; // 42 // 200
    const countTo = req.query.countTo; // 420 // 3500

    const countTotal = countTo - countFrom; // 378 // 3300
    const countTotalFloat = countTotal / 1000; // 0.378 // 3.3
    const integerPart = Math.floor(countTotalFloat); // 0 // 3
    const floatPart = integerPart === 0
        ? countTotal
        : (Math.abs(+(countTotalFloat - (Math.floor(countTotalFloat)).toFixed(3))) * 1000); // 378 // 300

    const reqFloatPart = floatPart; // 378 // 300
    const reqIntegerPart = integerPart * 1000; //  0 // 3000
    const reqOffset = countFrom;

    let pixArray = [];
    console.log('countFrom:', countFrom);
    console.log('countTo:', countTo);
    console.log('countTotal:', countTotal);
    console.log('countTotalFloat:', countTotalFloat);
    console.log('integerPart:', integerPart);
    console.log('floatPart:', floatPart);

    console.log('reqFloatPart:', reqFloatPart);
    console.log('reqIntegerPart:', reqIntegerPart);
    console.log('reqOffset:', countFrom);

    if (integerPart === 0) {
        // single request
        const link = `https://api.vk.com/` +
            `method/photos.get` +
            `?owner_id=${req.session.user.vkId}` +
            `&access_token=${req.session.user.vkToken}` +
            `&album_id=saved` +
            `&photo_sizes=1` +
            `&offset=${reqOffset}` +
            `&count=${reqFloatPart}` +
            `&v=5.103`;
        axios.get(link)
            .then(function (response) {
                console.log('response: ', response);
                const arr = [];
                if (response.data.response) {
                    // todo move to helper function (middleware)
                    response.data.response.items.forEach((item) => {
                        // ascending flow
                        // S -> M -> X -> Y -> Z -> W
                        const sizeW = item.sizes.find(size => size.type === 'w');
                        const sizeZ = item.sizes.find(size => size.type === 'z');
                        const sizeY = item.sizes.find(size => size.type === 'y');
                        const sizeX = item.sizes.find(size => size.type === 'x');
                        const sizeM = item.sizes.find(size => size.type === 'm');
                        const sizeS = item.sizes.find(size => size.type === 's');
                        if (sizeW) {
                            arr.push(sizeW);
                        } else if (sizeZ) {
                            arr.push(sizeZ);
                        } else if (sizeY) {
                            arr.push(sizeY);
                        } else if (sizeX) {
                            arr.push(sizeX);
                        } else if (sizeM) {
                            arr.push(sizeM);
                        } else if (sizeS) {
                            arr.push(sizeS);
                        }
                        pixArray = arr;
                        req.session.user.pixArray = pixArray;
                    });
                }
                res.status(200).json( { body: { pixArray: pixArray } });
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    } else if (integerPart > 0) {
        // multiple requests
        let offsetLast;
        let urlArray = [];
        for (let offset = reqOffset, count = 1000; offset < reqIntegerPart; offset = offset + 1000) {
            const link = `https://api.vk.com/` +
                `method/photos.get` +
                `?owner_id=${req.session.user.vkId}` +
                `&access_token=${req.session.user.vkToken}` +
                `&album_id=saved` +
                `&photo_sizes=1` +
                `&offset=${offset}` +
                `&count=${count}` +
                `&v=5.103`;
            urlArray.push(link);
            offsetLast = offset + 1000;
        }
        const linkLast = `https://api.vk.com/` +
            `method/photos.get` +
            `?owner_id=${req.session.user.vkId}` +
            `&access_token=${req.session.user.vkToken}` +
            `&album_id=saved` +
            `&photo_sizes=1` +
            `&offset=${offsetLast}` +
            `&count=${reqFloatPart}` +
            `&v=5.103`;

        urlArray.push(linkLast);

        const urlArrayPromises = urlArray.map((url) => {
            return axios.get(url);
        });

        async function photosFetcher() {
            try {
                const result = await axios.all(urlArrayPromises);
                const arrays = result.map(r => r.data).map(r => r.response).map(r => r.items);
                let photos = [];
                arrays.forEach((array) => {
                    photos = photos.concat(array)
                });
                const arr = [];
                if (photos) {
                    photos.forEach((item) => {
                        // ascending flow
                        // S -> M -> X -> Y -> Z -> W
                        const sizeW = item.sizes.find(size => size.type === 'w');
                        const sizeZ = item.sizes.find(size => size.type === 'z');
                        const sizeY = item.sizes.find(size => size.type === 'y');
                        const sizeX = item.sizes.find(size => size.type === 'x');
                        const sizeM = item.sizes.find(size => size.type === 'm');
                        const sizeS = item.sizes.find(size => size.type === 's');
                        if (sizeW) {
                            arr.push(sizeW);
                        } else if (sizeZ) {
                            arr.push(sizeZ);
                        } else if (sizeY) {
                            arr.push(sizeY);
                        } else if (sizeX) {
                            arr.push(sizeX);
                        } else if (sizeM) {
                            arr.push(sizeM);
                        } else if (sizeS) {
                            arr.push(sizeS);
                        }
                        pixArray = arr;
                        req.session.user.pixArray = pixArray;
                    });
                }
                res.status(200).json( { body: { pixArray: pixArray } });
            } catch (error) {
                console.error(error);
            }
        }

        photosFetcher();
    }
});

module.exports = router;