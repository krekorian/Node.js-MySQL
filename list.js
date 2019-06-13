var itemPurchased = function (inputItem, inputQuantity, inputPrice) {
    this.item = inputItem;
    this.quantity = inputQuantity;
    this.price = inputPrice;
    this.calculate = function () {
        // console.log(this.quantity * this.price);
        return (this.quantity * this.price).toFixed(2);
    }
}

module.exports = itemPurchased;