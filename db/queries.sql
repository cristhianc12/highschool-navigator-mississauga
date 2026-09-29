-- Example analyses over the anonymous responses.
-- RULE: never report or act on groups smaller than 5 responses (k-anonymity).
-- Every query below applies "having count(*) >= 5".

-- Responses per language and month
select date_trunc('month', created_on) as month, lang, count(*)
from quiz_responses group by 1, 2 having count(*) >= 5 order by 1 desc;

-- Which schools appear most often as the #1 suggestion
select top_schools[1] as school, count(*)
from quiz_responses where cardinality(top_schools) > 0
group by 1 having count(*) >= 5 order by 2 desc;

-- Interests (q1) versus the top program suggested
select i as interest, top_programs[1] as program, count(*)
from quiz_responses, jsonb_array_elements_text(answers->'q1') as i
where cardinality(top_programs) > 0
group by 1, 2 having count(*) >= 5 order by 3 desc;

-- Future plans (q5) versus desired challenge (q3)
select answers->>'q5' as future, answers->>'q3' as challenge, count(*)
from quiz_responses group by 1, 2 having count(*) >= 5 order by 3 desc;

-- Interest in French (q7) by broad area of the city (q12)
select answers->>'q12' as area, answers->>'q7' as french, count(*)
from quiz_responses where answers ? 'q12'
group by 1, 2 having count(*) >= 5 order by 3 desc;
