<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
</head>
<body>
<?php
// Calls cert_map() to initialize map
echo cert_map();

// Display map - cert_map() initializes map container and prepares data.
function cert_map() {
  // Pulls certificate data from Google Doc and generates array	
  $arrCSV = csvToArr( "https://docs.google.com/spreadsheets/d/e/2PACX-1vTLYgx6smmo4Ng7jc866p2gURbPjVfqQof50BWnhN53Q-kuv-QeJt47FJUXmuarm1a8j5W2ooQ0IocH/pub?gid=0&single=true&output=csv", ',' );
  // Pull OUID API data to generate array
  $arrOUID = ouidToArr( "https://www.reso.org/ouid/" );
  // Calls function to merge arrays by OUID	
  $arrResult = merge_two_arrays( $arrCSV, $arrOUID );
//  // Identifies duplicate records	
//  find_duplicates( $arrResult );

  $jsonResult = str_replace( '["', '[', str_replace( '"]', ']', json_encode( $arrResult ) ) );
  $list = "<div><script> certJSON =" . $jsonResult . ";</script></div>";
  $fp = fopen( 'mapcert.json', 'w' );
  fwrite( $fp, $jsonResult );
  fclose( $fp );
  $list .= '<div id="map" style="width:100%; height:700px;margin: 0 auto; background:#2b94cb;"></div>';
  return $list;
}

function csvToArr( $file, $delimiter ) {
  if ( !ini_set( 'default_socket_timeout', 25 ) )echo "<!-- unable to change socket timeout -->";
  if ( ( $handle = fopen( $file, "r" ) ) === false ) {
    die( "csvToArr - can't open the file*." );
  }
  $csv_headers = fgetcsv( $handle, 20000, $delimiter );
  $csv_json = array();
  $c = 0;
  while ( $row = fgetcsv( $handle, 20000, $delimiter ) ) {
    if ( $row[ 11 ] ) {
      $csv_json[ $c ][ 'organization' ] = $row[ 0 ];
      $csv_json[ $c ][ 'product-name-version' ] = $row[ 1 ];
      $csv_json[ $c ][ 'certification-type' ] = $row[ 2 ];
      $csv_json[ $c ][ 'version' ] = $row[ 3 ];
      $csv_json[ $c ][ 'status' ] = $row[ 4 ];
      $csv_json[ $c ][ 'date-certified' ] = $row[ 5 ];
      $csv_json[ $c ][ 'certificate-expiration' ] = $row[ 6 ];
      $csv_json[ $c ][ 'details' ] = $row[ 7 ];
      $csv_json[ $c ][ 'membership-size' ] = $row[ 8 ];
      $csv_json[ $c ][ 'zip' ] = $row[ 9 ];
      $csv_json[ $c ][ 'certification-appuid' ] = $row[ 10 ];
      $csv_json[ $c ][ 'ouid' ] = str_replace( '?', '', $row[ 11 ] );
      $csv_json[ $c ][ 'blog-status' ] = $row[ 12 ];
      $csv_json[ $c ][ 'certificate-replacement-notes' ] = $row[ 13 ];
      $csv_json[ $c ][ 'applicant-type' ] = $row[ 14 ];
      $csv_json[ $c ][ 'platform' ] = $row[ 15 ];
      $csv_json[ $c ][ 'security' ] = $row[ 16 ];
      $c++;
    }
  }
  fclose( $handle );
  $i = 0;
  foreach ( $csv_json as $r ) {
    $curID = $r[ 'ouid' ];

    if ( ( $curID !== "street and city don't match" ) || ( $curID !== "not found" ) ) {
      if ( $r[ 'status' ] == 'Active' ) {
        foreach ( $csv_json as $b ) {
          if ( $r[ 'certification-appuid' ] != $b[ 'certification-appuid' ] ) {
            if ( ( $b[ 'ouid' ] == $curID ) && ( $b[ 'status' ] == 'Active' ) ) {
              //              echo $curID . ' - ' . $r[ 'status' ] . '<br />';
              if ( strpos( $csv_json[ $i ][ 'certification-type' ], $b[ 'certification-type' ] ) != true ) {
                $csv_json[ $i ][ 'certification-type' ] .= '|' . $b[ 'certification-type' ];
                $csv_json[ $i ][ 'version' ] .= '|' . $b[ 'version' ];
              }
              $csv_json[ $i ][ 'details' ] .= '|' . $b[ 'details' ];
            }
          }
        }
      }
    }
    $i++;
  }
  return $csv_json;
}

function ouidToArr( $url ) {
  $xml = simplexml_load_file( $url );
  $arrXML = object_to_array( $xml );
  $i = 0;
  $arrOUID = array();
  foreach ( $arrXML[ 'organization' ] as $x ) {
    $arrOUID[ $i ][ 'organization' ] = $x[ 'name' ];
    $arrOUID[ $i ][ 'ouid' ] = $x[ 'ouid' ];
    $arrOUID[ $i ][ 'properties' ][ 'name' ] = $x[ 'name' ];
    $arrOUID[ $i ][ 'active' ] = $x[ 'active' ];
    $arrOUID[ $i ][ 'url' ] = $x[ 'url' ];
    $arrOUID[ $i ][ 'org_type' ] = $x[ 'type' ];
    $arrOUID[ $i ][ 'assoc2mls' ] = $x[ 'assoc2mls' ];
    $arrOUID[ $i ][ 'address' ] = $x[ 'location' ][ 'address' ];
    $arrOUID[ $i ][ 'city' ] = $x[ 'location' ][ 'city' ];
    $arrOUID[ $i ][ 'state' ] = $x[ 'location' ][ 'state' ];
    $arrOUID[ $i ][ 'zip' ] = $x[ 'location' ][ 'zip' ];
    $arrOUID[ $i ][ 'country' ] = $x[ 'location' ][ 'country' ];
    if ( ( $x[ 'location' ][ 'longitude' ] != '' ) && ( $x[ 'location' ][ 'latitude' ] != '' ) ) {
      $arrOUID[ $i ][ 'type' ] = "Feature";
      $arrOUID[ $i ][ 'geometry' ][ 'type' ] = "Point";
      $arrOUID[ $i ][ 'geometry' ][ 'coordinates' ] = [ $x[ 'location' ][ 'longitude' ] . ',' . $x[ 'location' ][ 'latitude' ] ];
    }
    $i++;
  }
  return $arrOUID;
}

function object_to_array( $obj ) {
  $_arr = is_object( $obj ) ? get_object_vars( $obj ) : $obj;
  foreach ( $_arr as $key => $val ) {
    $val = ( is_array( $val ) || is_object( $val ) ) ? object_to_array( $val ) : $val;
    $arr[ $key ] = $val;
  }
  return $arr;
}

function merge_two_arrays( $array1, $array2 ) {
  $data = array();
  $arrayAB = array_merge( $array1, $array2 );
  foreach ( $arrayAB as $value ) {
    $id = $value[ 'ouid' ];
    if ( !isset( $data[ $id ] ) ) {
      $data[ $id ] = array();
    }
    $data[ $id ] = array_merge( $data[ $id ], $value );
  }
  $arrCert = array();
  foreach ( $data as $d ) {
    array_push( $arrCert, $d );
  }
  return $arrCert;
}

function find_duplicates( $data ) {
  $arr = [];
  foreach ( $data as $key => $r ) {
    if ( array_search( $r[ 'ouid' ], $arr ) !== false ) {
      unset( $data[ $key ] );
    } else {
      $arr[] = $r[ 'ouid' ];
    }
  }
	//print_r($arr);
}
?>
<!-- Loads Leaflet files to generate map -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.3/dist/leaflet.css"  integrity="sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ=="  crossorigin=""/>
<script src="https://unpkg.com/leaflet@1.3.3/dist/leaflet.js" integrity="sha512-tAGcCfR4Sc5ZP5ZoVz0quoZDYX5aCtEm/eu1KhSLj2c9eFrylXZknQYmxUssFaVJKvvc0dJQixhGjG2yXWiV9Q=="  crossorigin=""></script> 
<!-- Custom JS to process cert data to display on map --> 
<script src="/js/certmaps.js"></script>
<link rel="stylesheet" href="/css/styles.css" />
</body>
</html>
