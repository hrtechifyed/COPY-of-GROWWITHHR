/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Intelligence Graph
 * -----------------------------------------------------------------------------
 * File      : js/core/intelligence-graph.js
 * Version   : 1.0.0
 * =============================================================================
 */

class IntelligenceGraph {

    constructor() {

        this.nodes = [];

        this.edges = [];

        this.loadDefaults();

    }

    loadDefaults() {

        this.nodes = [

            "organization",

            "compliance",

            "hiring",

            "performance",

            "leadership",

            "talent",

            "learning",

            "rewards",

            "culture",

            "policy"

        ];

        this.edges = [

            {
                from: "organization",
                to: "compliance"
            },

            {
                from: "hiring",
                to: "learning"
            },

            {
                from: "learning",
                to: "performance"
            },

            {
                from: "performance",
                to: "rewards"
            },

            {
                from: "leadership",
                to: "culture"
            },

            {
                from: "culture",
                to: "performance"
            },

            {
                from: "talent",
                to: "leadership"
            }

        ];

    }

    modules() {

        return [...this.nodes];

    }

    relationships() {

        return [...this.edges];

    }

    downstream(module) {

        return this.edges

            .filter(edge =>

                edge.from === module

            )

            .map(edge =>

                edge.to

            );

    }

    upstream(module) {

        return this.edges

            .filter(edge =>

                edge.to === module

            )

            .map(edge =>

                edge.from

            );

    }

    addRelationship(from, to) {

        this.edges.push({

            from,

            to

        });

    }

    summary() {

        return {

            modules:

                this.nodes.length,

            relationships:

                this.edges.length

        };

    }

}

const intelligenceGraph =
    new IntelligenceGraph();

export { IntelligenceGraph };

export default intelligenceGraph;
