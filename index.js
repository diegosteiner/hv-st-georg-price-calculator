var PriceCalculator = Vue.component('price-calculator', {
	template: `
   <div class="grid">
    <label class="label">Art:</label>
    <div>
      <input type="radio" id="occupancy_type_camp" value="camp" v-model="occupancy_type">
      <label for="occupancy_type_camp">Lager/Kurs</label>
      <br>

      <input type="radio" id="occupancy_type_festivity" value="festivity" v-model="occupancy_type">
      <label for="occupancy_type_festivity">Fest</label>
    </div>

    <label for="nights" class="label"># Nächte:</label>
    <div>
      <input min="1" max="30" type="number" name="nights" size="4" v-model="nights">
    </div>

    <label for="people_t1" class="label"># Kinder / Jugendliche:</label>
    <div>
      <input type="number" min="0" max="28" required="required" name="people_t1"  v-model="people_t1">
    </div>

    <label for="people_t2" class="label"># Erwachsene (ab 25 Jahren):</label>
    <div>
      <input type="number" min="0" max="20" required="required" name="people_t2" v-model="people_t2">
    </div>

    <label class="label">unverbindliche Preisschätzung:</label>
    <div><strong>{{ price_formatted }}</strong></div>

    <p style="font-size: 0.7em;">
      Es wird nach der Belegung mit den effektiv entstandenen Kosten abgerechnet (Personen/Nebenkosten/Schäden am
      Haus). Diese variieren bei den Nebenkosten je nach Hausnutzung und Jahreszeit. Unser Preisrechner rechnet mit dem
      Durchschnitt der Nebenkosten
      der vergangenen Belegungen. Beachten Sie deshalb, dass wir so nur eine unverbindliche Preisschätzung und
      keine verbindliche Offerte abbilden können.
    </p>
  </div>
  `,
  props: {
  	home_rates: Object
  },
  data() {
  	return {
      nights: 3,
      occupancy_type: 'camp',
      people_t1: 12,
      people_t2: 4,
      price_factor: 1.05,
      home: 'birchli',
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
  computed: {
    people_t1_with_min: function () {
      return Math.max(this.people_t1, this.home_rates.people_min - this.people_t2);
    },
    people_t1_max: function () {
      return this.home_rates.people_max - this.people_t2;
    },
    people_t2_max: function () {
      return this.home_rates.people_max - this.people_t1;
    },
    nights_max: function () {
      switch (this.occupancy_type) {
        case 'festivity':
          return 3;
        default:
          return 30;
      }
    },
    price: function () {
      var taxes = (this.people_t1 * this.home_rates.tax_t1 * this.nights) +
        (this.people_t2 * this.home_rates.tax_t2 * this.nights);
      var additional_costs = (this.home_rates.additional_costs_night * this.nights) +
        (this.home_rates.rate_flat);
      var price = 0
      switch (this.occupancy_type) {
        case 'festivity':
          price = this.home_rates.fixed_price[this.nights - 1];
          break;
        default:
          price = (this.people_t1_with_min * this.home_rates.rate_t1 * this.nights) +
            (this.people_t2 * this.home_rates.rate_t2 * this.nights);
      }
      return (price + taxes + additional_costs) * this.price_factor;
    },
    price_formatted: function () {
      return this.price.toFixed(2);
    }
  }
})

new Vue({
	components: { PriceCalculator }
}).$mount('#pricecalc');
