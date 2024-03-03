<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CountryResource\Pages;
//use App\Filament\Resources\CountryResource\RelationManagers;
use App\Models\Country;
use Filament\Forms;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Field;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Carbon;

class CountryResource extends Resource
{
    protected static ?string $model = Country::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $recordTitleAttribute = 'nom_fr';
    protected static ?string $navigationLabel = 'Pays';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('alpha2')->label('Code 2')->required(),
                TextInput::make('alpha3')->label('Code 3')->required(),
                TextInput::make('nom_en')->label('Nom anglais')->required(),
                TextInput::make('nom_en')->label('Nom français')->required(),
                TextInput::make('lat')->label('Latitude')->required(),
                TextInput::make('lng')->label('Longitude')->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('alpha2')->label('Code 2')->sortable()->searchable(),
                TextColumn::make('nom_fr')->label('Nom français')->sortable()->searchable(),
                TextColumn::make('nom_en')->label('Nom anglais')->sortable()->searchable(),
                TextColumn::make('lat')->label('Latitude')->sortable()->searchable(),
                TextColumn::make('lng')->label('Longitude')->sortable()->searchable(),
            ])
            ->filters([
                Filter::make('created_at')
                    ->form([
                        DatePicker::make('created_from')->label('Créé à partir de'),
                        DatePicker::make('created_until')->label('Créé jusqu\'au'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['created_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                        if ($data['created_from'] ?? null) {
                            $indicators['created_from'] = 'Créé depuis le ' . Carbon::parse($data['created_from'])->format('d/m/Y');
                        }
                        if ($data['created_until'] ?? null) {
                            $indicators['created_until'] = 'Créé jusqu\'à ' . Carbon::parse($data['created_until'])->format('d/m/Y');
                        }

                        return $indicators;
                    }),

                Filter::make('lat')
                    ->form([
                        TextInput::make('lat')->numeric()->label('Latitude'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['lat'],
                                fn (Builder $query, $lat): Builder => $query->where('lat', 'like', '%'.$lat.'%'),
                            );
                    }),
            ])
            ->deferFilters()
            //->filtersFormColumns(3)
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCountries::route('/'),
            'create' => Pages\CreateCountry::route('/create'),
            'edit' => Pages\EditCountry::route('/{record}/edit'),
        ];
    }
}
