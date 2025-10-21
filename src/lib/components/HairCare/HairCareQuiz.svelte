
<script lang="ts">
    import { get } from 'svelte/store';
    import { translations } from '$lib/translations';
    import { createEventDispatcher } from 'svelte';

    const t = get(translations);
    const dispatch = createEventDispatcher();

    let currentQuestionIndex = 0;
    let userAnswers: { [key: string]: string } = {};
    let quizFinished = false;

    const quiz = t.hair_care_quiz;

    function handleAnswer(questionKey: string, answerKey: string) {
        userAnswers[questionKey] = answerKey;
        if (currentQuestionIndex < quiz.questions.length - 1) {
            currentQuestionIndex++;
        } else {
            finishQuiz();
        }
    }

    function finishQuiz() {
        quizFinished = true;
        // Simple logic: recommend the tip category that matches the most answers
        const answerCounts: { [key: string]: number } = {};
        for (const q of quiz.questions) {
            const userAnswer = userAnswers[q.key];
            const answer = q.answers.find(a => a.key === userAnswer);
            if (answer && answer.recommends) {
                for (const rec of answer.recommends) {
                    answerCounts[rec] = (answerCounts[rec] || 0) + 1;
                }
            }
        }

        const sortedRecommendations = Object.entries(answerCounts).sort((a, b) => b[1] - a[1]);
        const topRecommendations = sortedRecommendations.slice(0, 2).map(r => r[0]);

        dispatch('quizComplete', topRecommendations);
    }

    function resetQuiz() {
        currentQuestionIndex = 0;
        userAnswers = {};
        quizFinished = false;
        dispatch('quizReset');
    }

</script>

<div class="p-6 bg-base-200 rounded-lg shadow-inner">
    <h3 class="text-2xl font-bold text-center mb-4">{quiz.title}</h3>

    {#if !quizFinished}
        <div>
            {@const question = quiz.questions[currentQuestionIndex]}
            <p class="text-lg text-center mb-6">{question.text}</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each question.answers as answer}
                    <button class="btn btn-lg" on:click={() => handleAnswer(question.key, answer.key)}>
                        {answer.text}
                    </button>
                {/each}
            </div>
        </div>
    {:else}
        <div class="text-center">
            <h4 class="text-xl font-semibold">{quiz.result_title}</h4>
            <p class="my-4">{quiz.result_text}</p>
            <p class="font-bold mb-4">Odporúčané kategórie pre vás:</p>
            <button class="btn btn-secondary" on:click={resetQuiz}>{quiz.reset_button}</button>
        </div>
    {/if}
</div>
