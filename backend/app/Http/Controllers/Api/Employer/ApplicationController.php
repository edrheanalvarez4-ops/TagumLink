<?php

namespace App\Http\Controllers\Api\Employer;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Opportunity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    // Applicants for one of the employer's own listings
    public function index(Request $request, Opportunity $opportunity): JsonResponse
    {
        $organization = $request->user()->organization;

        abort_unless(
            $organization && $opportunity->organization_id === $organization->id,
            403,
            'You can only view applicants for your own listings.'
        );

        $applications = $opportunity->applications()
            ->with(['applicant:id,name,email', 'applicant.profile'])
            ->latest()
            ->get();

        return response()->json($applications);
    }

    public function updateStatus(Request $request, Application $application): JsonResponse
    {
        $organization = $request->user()->organization;

        abort_unless(
            $organization && $application->opportunity->organization_id === $organization->id,
            403,
            'You can only update applications for your own listings.'
        );

        $data = $request->validate([
            'status' => ['required', 'in:pending,reviewing,shortlisted,accepted,rejected'],
            'employer_remarks' => ['nullable', 'string'],
        ]);

        $application->update($data);

        return response()->json($application);
    }
}