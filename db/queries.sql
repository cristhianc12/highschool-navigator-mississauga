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

-- ===================== Usage statistics (metrics_daily) =====================
-- Same rule: do not report cells below 5 events (sum(n) >= 5).

-- Visits and page views per day
select day, sum(n) filter (where event = 'visit') as visits, sum(n) filter (where event = 'pv') as page_views
from metrics_daily group by 1 order by 1 desc limit 60;

-- Device, OS and browser mix of visits
select device, os, browser, sum(n) as visits from metrics_daily where event = 'visit'
group by 1, 2, 3 having sum(n) >= 5 order by 4 desc;

-- Where visits come from (direct, search, social, school sites, email) and installed-app (pwa) share
select a as source, b as mode, sum(n) as visits from metrics_daily where event = 'visit'
group by 1, 2 having sum(n) >= 5 order by 3 desc;

-- Visits by language and by province
select lang, region, sum(n) as visits from metrics_daily where event = 'visit'
group by 1, 2 having sum(n) >= 5 order by 3 desc;

-- Most opened school profiles, and from where (card, map, compare, search results...)
select a as school, sum(n) as opens from metrics_daily where event = 'school_open'
group by 1 having sum(n) >= 5 order by 2 desc limit 50;
select a as school, b as opened_from, sum(n) from metrics_daily where event = 'school_open'
group by 1, 2 having sum(n) >= 5 order by 3 desc limit 50;

-- Most opened programs
select a as program, sum(n) as opens from metrics_daily where event = 'program_open'
group by 1 having sum(n) >= 5 order by 2 desc limit 50;

-- Clicks to official websites: which kind of link and which site
select a as kind, b as host, sum(n) as clicks from metrics_daily where event = 'outbound'
group by 1, 2 having sum(n) >= 5 order by 3 desc limit 50;

-- Filters people use (region, board, program type, ...) and the values they pick
select a as filter, b as value, sum(n) as uses from metrics_daily where event = 'filter'
group by 1, 2 having sum(n) >= 5 order by 3 desc;

-- Questionnaire funnel
select a as step, b as detail, sum(n) as events from metrics_daily where event = 'quiz'
group by 1, 2 having sum(n) >= 5 order by 1, 2;

-- Engagement: time on page and scroll depth
select a as time_on_page, b as scroll_depth, sum(n) as page_views from metrics_daily where event = 'engage'
group by 1, 2 having sum(n) >= 5 order by 3 desc;

-- Feature use: compare, My list (add/export), map (load, legend, locate), sessions calendar, course finder
select event, a, sum(n) as uses from metrics_daily where event in ('compare', 'mylist', 'map', 'session', 'courses', 'game')
group by 1, 2 having sum(n) >= 5 order by 1, 3 desc;
