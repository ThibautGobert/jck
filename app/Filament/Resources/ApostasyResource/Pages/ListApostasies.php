<?php

namespace App\Filament\Resources\ApostasyResource\Pages;

use App\Filament\Resources\ApostasyResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListApostasies extends ListRecords
{
    protected static string $resource = ApostasyResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
