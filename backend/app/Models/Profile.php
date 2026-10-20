<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'phone',
        'education_level',
        'academic_program',
        'school_name',
        'skills',
        'experience',
        'preferred_location',
        'resume_path',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}