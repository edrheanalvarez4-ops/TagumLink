<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Opportunity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $profile = $request->user()->profile;

        if (! $profile) {
            return response()->json([]);
        }

        $mySkills = $this->words($profile->skills);

        $results = Opportunity::where('status', 'open')
            ->where(fn ($q) => $q->whereNull('deadline')->orWhere('deadline', '>=', today()))
            ->with('organization:id,organization_name')
            ->get()
            ->map(function ($job) use ($profile, $mySkills) {
                $score = 0;
                $reasons = [];

                if ($profile->academic_program && $job->academic_program
                    && stripos($job->academic_program, $profile->academic_program) !== false) {
                    $score += 3;
                    $reasons[] = 'Matches your academic program';
                }

                if ($profile->preferred_location && stripos($job->location, $profile->preferred_location) !== false) {
                    $score += 2;
                    $reasons[] = 'In your preferred location';
                }

                $shared = array_intersect($mySkills, $this->words($job->required_skills));
                if ($shared) {
                    $score += count($shared);
                    $reasons[] = 'Matching skills: ' . implode(', ', $shared);
                }

                $job->score = $score;
                $job->reasons = $reasons;

                return $job;
            })
            ->filter(fn ($job) => $job->score > 0)
            ->sortByDesc('score')
            ->take(10)
            ->values();

        return response()->json($results);
    }

    private function words(?string $text): array
    {
        return array_values(array_unique(array_filter(
            array_map('trim', explode(',', strtolower((string) $text)))
        )));
    }
}