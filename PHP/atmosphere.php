<?php
// Détection environnement webetu
$is_webetu = str_contains($_SERVER['HTTP_HOST'] ?? '', 'webetu')
          || str_contains($_SERVER['SERVER_NAME'] ?? '', 'webetu');

// Contexte HTTP commun
$opts = [
    'http' => [
        'timeout' => 5,
        'method'  => 'GET',
        'header'  => "User-Agent: Mozilla/5.0\r\n"
    ],
    'ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false
    ]
];

if ($is_webetu) {
    $opts['http']['proxy'] = 'tcp://www-cache:3128';
    $opts['http']['request_fulluri'] = true;
}

$context = stream_context_create($opts);

// IP client
$client_ip = $_SERVER['HTTP_X_FORWARDED_FOR']
          ?? $_SERVER['REMOTE_ADDR']
          ?? '';

// Géolocalisation IP (fallback Nancy)
$latitude = 48.6921;
$longitude = 6.1844;
$city = 'Nancy';
$departement = 'Meurthe-et-Moselle';

$geo_xml = @file_get_contents("http://ip-api.com/xml/$client_ip", false, $context);
if ($geo_xml) {
    $geo = @simplexml_load_string($geo_xml);
    if ($geo && $geo->status === 'success' && stripos($geo->city, 'nancy') !== false) {
        $latitude = (float)$geo->lat;
        $longitude = (float)$geo->lon;
        $city = (string)$geo->city;
        $departement = (string)$geo->regionName;
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Atmosphère - Aide à la décision</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
    <link rel="stylesheet" href="style.css">

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</head>
<body>

<div class="container">
    <h1>Atmosphère – Aide à la décision de déplacement</h1>

    <p><strong>Localisation :</strong> <?= htmlspecialchars($city) ?> (<?= htmlspecialchars($departement) ?>)</p>
    <p><strong>Coordonnées :</strong> <?= $latitude ?>, <?= $longitude ?></p>
    <p><strong>IP :</strong> <?= htmlspecialchars($client_ip) ?></p>

    <!-- ================== CIRCULATION ================== -->
    <section id="circulation">
        <h2>Difficultés de circulation – Grand Nancy</h2>
        <div id="map"></div>

        <script>
            const map = L.map('map').setView([<?= $latitude ?>, <?= $longitude ?>], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(map);

            L.marker([<?= $latitude ?>, <?= $longitude ?>])
                .addTo(map)
                .bindPopup('Position actuelle');
        </script>

        <?php
        // Incidents de circulation
        $incidents = json_decode(
            @file_get_contents(
                "https://carto.g-ny.eu/data/cifs/cifs_waze_v2.json",
                false,
                $context
            ),
            true
        )['incidents'] ?? [];
        ?>

        <script>
        <?php foreach ($incidents as $i):
            $coords = explode(' ', $i['location']['polyline']);
            if (count($coords) < 2) continue;

            $color = $i['type'] === 'CONSTRUCTION' ? 'orange' : 'red';
        ?>
            L.marker([<?= $coords[0] ?>, <?= $coords[1] ?>], {
                icon: L.divIcon({
                    html: "<div style='background:<?= $color ?>;width:12px;height:12px;border-radius:50%'></div>",
                    iconSize: [12, 12]
                })
            })
            .addTo(map)
            .bindPopup("<?= addslashes($i['short_description']) ?>");
        <?php endforeach; ?>
        </script>
    </section>
</div>

</body>
</html>
