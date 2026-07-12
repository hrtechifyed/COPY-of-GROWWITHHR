class CompanyDNA {

    constructor(data = {}) {

        this.company = {

            companyName: data.companyName || "",

            entityType: data.entityType || "",

            industry: data.industry || "",

            natureOfBusiness: data.natureOfBusiness || "",

            yearOfIncorporation: data.yearOfIncorporation || "",

            countries: data.countries || ["India"],

            states: data.states || [],

            cities: data.cities || [],

            workModel: data.workModel || "",

            workforce: {

                permanent: data.workforce?.permanent || 0,

                contract: data.workforce?.contract || 0,

                interns: data.workforce?.interns || 0,

                apprentices: data.workforce?.apprentices || 0,

                consultants: data.workforce?.consultants || 0,

                gigWorkers: data.workforce?.gigWorkers || 0

            },

            growth: {

                projectedEmployees: data.growth?.projectedEmployees || 0,

                expandingStates: data.growth?.expandingStates || false,

                internationalHiring: data.growth?.internationalHiring || false

            }

        };

    }

    get() {

        return structuredClone(this.company);

    }

    set(data) {

        this.company = structuredClone(data);

    }

    update(field, value) {

        this.company[field] = value;

    }

    updateWorkforce(field, value) {

        this.company.workforce[field] = Number(value);

    }

    updateGrowth(field, value) {

        this.company.growth[field] = value;

    }

    addCountry(country) {

        if (!this.company.countries.includes(country)) {

            this.company.countries.push(country);

        }

    }

    addState(state) {

        if (!this.company.states.includes(state)) {

            this.company.states.push(state);

        }

    }

    addCity(city) {

        if (!this.company.cities.includes(city)) {

            this.company.cities.push(city);

        }

    }

    removeCountry(country) {

        this.company.countries = this.company.countries.filter(item => item !== country);

    }

    removeState(state) {

        this.company.states = this.company.states.filter(item => item !== state);

    }

    removeCity(city) {

        this.company.cities = this.company.cities.filter(item => item !== city);

    }

    getTotalEmployees() {

        const workforce = this.company.workforce;

        return (

            workforce.permanent +

            workforce.contract +

            workforce.interns +

            workforce.apprentices +

            workforce.consultants +

            workforce.gigWorkers

        );

    }

    getCountryCount() {

        return this.company.countries.length;

    }

    getStateCount() {

        return this.company.states.length;

    }

    getCityCount() {

        return this.company.cities.length;

    }

    isMultiState() {

        return this.getStateCount() > 1;

    }

    isInternational() {

        return this.getCountryCount() > 1;

    }

    isGrowing() {

        return this.company.growth.projectedEmployees > this.getTotalEmployees();

    }

}
