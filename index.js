new Vue({
  el: '#pricecalc',
  data: {
    nights: 2,
    occupancy_type: 'camp',
    people_t1: 12,
    people_t2: 4,
    price_factor: 1.05,
    home: null,
    home_rates: {
      birchli: {
        people_min: 12,
        people_max: 32,
        rate_t1: 14.0 + 2.0,
        rate_t2: 19.5 + 2.5,
        tax_t1: 0.65,
        tax_t2: 1.3,
        additional_costs_night: 1.3,
        rate_flat: 100.0,
        fixed_price: [
          360.0,
          625.0,
          985.0
        ]
      },
      villa: {
        people_min: 25,
        people_max: 50,
        rate_t1: 14.0 + 2.0,
        rate_t2: 19.5 + 2.5,
        tax_t1: 1.5,
        tax_t2: 3.0,
        additional_costs_night: 2.0,
        rate_flat: 120.0,
        fixed_price: [
          560.0,
          975.0,
          1540.0
        ]
      },
      muehlebaechli: {
        people_min: 12,
        people_max: 31,
        rate_t1: 13.0 + 2.0,
        rate_t2: 18.5 + 2.5,
        tax_t1: 1.5,
        tax_t2: 3.0,
        additional_costs_night: 1.45,
        rate_flat: 100.0,
        fixed_price: [
          320.0,
          560.0,
          885.0
        ]
      },
      haselhaus: {
        people_min: 12,
        people_max: 28,
        rate_t1: 14.0 + 2.0,
        rate_t2: 19.5 + 2.5,
        tax_t1: 0,
        tax_t2: 0,
        additional_costs_night: 1.3,
        rate_flat: 100.0,
        fixed_price: [
          320.0,
          560.0,
          885.0
        ]
      }
    }
  },
  watch: {
    people_t1: function (value) {
      this.people_t1 = Math.min(value, this.people_t1_max);
    },
    people_t2: function (value) {
      this.people_t2 = Math.min(value, this.people_t2_max);
    },
    nights: function (value) {
      this.nights = Math.min(value, this.nights_max);
    }
  },
  beforeMount: function () {
    this.home = this.$el.attributes['data-home']?.value;
  },
  computed: {
    rates: function() {
      return this.home_rates[this.home] || {
        people_min: 0,
        people_max: 0,
        rate_t1: 0,
        rate_t2: 0,
        tax_t1: 0,
        tax_t2: 0,
        additional_costs_night: 0,
        rate_flat: 0,
        fixed_price: []
      };
    },
    people_t1_with_min: function () {
      return Math.max(this.people_t1, this.rates.people_min - this.people_t2);
    },
    people_t1_max: function () {
      return this.rates.people_max - this.people_t2;
    },
    people_t2_max: function () {
      return this.rates.people_max - this.people_t1;
    },
    nights_max: function () {
      switch (this.occupancy_type) {
        case 'festivity':
          return 2;
        default:
          return 30;
      }
    },
    price: function () {
      const taxes = (this.people_t1 * this.rates.tax_t1 * this.nights) +
        (this.people_t2 * this.rates.tax_t2 * this.nights);
      const additional_costs = (this.rates.additional_costs_night * (this.nights + 1)) +
        (this.rates.rate_flat);
      let price = 0
      switch (this.occupancy_type) {
        case 'festivity':
          price = this.rates.fixed_price[this.nights];
          break;
        default:
          price = (this.people_t1_with_min * this.rates.rate_t1 * this.nights) +
            (this.people_t2 * this.rates.rate_t2 * this.nights);
      }
      return (price + taxes + additional_costs) * this.price_factor;
    },
    price_formatted: function () {
      return this.price.toFixed(2);
    },
  }
});
