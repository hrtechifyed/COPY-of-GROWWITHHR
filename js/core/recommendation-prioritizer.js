/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Recommendation Prioritizer
 * -----------------------------------------------------------------------------
 * File      : js/core/recommendation-prioritizer.js
 * Version   : 1.0.0
 * =============================================================================
 */

class RecommendationPrioritizer {

    prioritize(recommendations = []) {

        return [...recommendations]

            .sort((a, b) => {

                const priority = {

                    High: 3,

                    Medium: 2,

                    Low: 1

                };

                const left =
                    priority[a.priority] || 0;

                const right =
                    priority[b.priority] || 0;

                return right - left;

            });

    }

    groupByPriority(recommendations = []) {

        return {

            high:

                recommendations.filter(item =>

                    item.priority === "High"

                ),

            medium:

                recommendations.filter(item =>

                    item.priority === "Medium"

                ),

            low:

                recommendations.filter(item =>

                    item.priority === "Low"

                )

        };

    }

    removeDuplicates(recommendations = []) {

        const unique = new Map();

        recommendations.forEach(item => {

            const key =

                item.title ||

                item.id ||

                JSON.stringify(item);

            if (!unique.has(key)) {

                unique.set(key, item);

            }

        });

        return [...unique.values()];

    }

    summarize(recommendations = []) {

        const unique =
            this.removeDuplicates(
                recommendations
            );

        const prioritized =
            this.prioritize(unique);

        return {

            total:
                prioritized.length,

            priorities:
                this.groupByPriority(
                    prioritized
                ),

            recommendations:
                prioritized

        };

    }

}

const recommendationPrioritizer =
    new RecommendationPrioritizer();

export { RecommendationPrioritizer };

export default recommendationPrioritizer;
