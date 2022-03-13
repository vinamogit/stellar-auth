

const hasAsset = (balances, config) => {

    for (var b of balances) {
        if (config.code == b.code && config.issuer == b.issuer && config.minAmount <= b.amount) {
            return true;
        }
    }

    return false;
}

const and = (balances, assets) => {

    var validation = [];
    for (var a of assets) {
        if (a.operator && a.assets) {
            if (a.operator == "and") {
                validation.push(and(balances, a.assets));
            }
            if (a.operator == "or") {
                validation.push(or(balances, a.assets));
            }
        } else {
            validation.push(hasAsset(balances, a));
        }
    }

    for (var valid of validation) {
        if (!valid) {
            return false;
        }
    }

    return true;
}

const or = (balances, assets) => {

    var validation = [];
    for (var a of assets) {
        if (a.operator && a.assets) {
            if (a.operator == "and") {
                validation.push(and(balances, a.assets));
            }
            if (a.operator == "or") {
                validation.push(or(balances, a.assets));
            }
        } else {
            validation.push(hasAsset(balances, a));
        }
    }

    for (var valid of validation) {
        if (valid) {
            return true;
        }
    }

    return false;
}

module.exports = function (account, filter) {
    var balances = [];
    console.log(account.balances)
    if (account.balances) {
        for (var b of account.balances) {

            var asset = {};
            if (b.asset_code) {
                asset.code = b.asset_code;
                asset.issuer = b.asset_issuer;
            } else if (b.asset_type == "native") {
                asset.code = "XLM";
            }
            asset.amount = parseFloat(b.balance) - parseFloat(b.selling_liabilities);

            if (asset.code) {
                balances.push(asset);
            }
        }
    }

    if (filter.operator && filter.assets) {
        if (filter.operator == "or") {
            return or(balances, filter.assets);
        }
        if (filter.operator == "and") {
            return and(balances, filter.assets);
        }
    }

    return false;
}