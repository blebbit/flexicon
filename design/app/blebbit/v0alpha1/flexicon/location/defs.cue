package location

import (
  "blebbit.app/flexicon/design/app/blebbit"
  "blebbit.app/flexicon/schema"
)

schema.#Lexicon

lexicon: 1
id: "\(blebbit.nsidBase).location.defs"

defs: {

  // all address fragments have an optional name
  [string]: properties: {
    name: schema.#String & {
      description: "The name of the location"
    }
  }

  address: schema.#Object & {
    description: "Address format for a physical location"
    properties: {
      street: schema.#String & {
        description: "A flexible street address, supports newlines"
      }
      locality: schema.#String & {
        description: "The locality for the address, like city or town"
      }
      subregion: schema.#String & {
        description: "An administrative subdivision, like a county"
      }
      region: schema.#String & {
        description: "The largest administrative region for a country, like a state or provence"
      }
      postalCode: schema.#String & {
        description: "The postal code for the location"
      }
      country: schema.#String & {
        description: "The ISO 3166 country code. Preferably the 2-letter code"
        minLength: 2
        maxLength: 10
      }
    }
  }

  fsq: schema.#Object & {
    description: "Foursquare Open Source Places dataset for a physical location",
    required: ["fsq_place_id"]
    properties: {
      fsq_place_id: schema.#String & {
        description: "The unique identifier of a Foursquare POI. Use this ID to view a venue at foursquare.com by visiting: http://www.foursquare.com/v/{fsq_place_id}"
      }
    }
  }

  geo: schema.#Object & {
    description: "WGS84 coordinate for a physical location",
    required: [ "latitude", "longitude" ]
    properties: {
      latitude: schema.#String & {
        description: "Latitude for the location"
      }
      longitude: schema.#String & {
        description: "Longitude for the location"
      }
      altitude: schema.#String & {
        description: "Altitude for the location"
      }
    }
  }

  h3: schema.#Object & {
    description: "H3 encoding for a physical location"
    required: ["value"]
    properties: {
      value: schema.#String & {
        description: "The H3 encoding value"
      }
    }
  }

  virtual: schema.#Object & {
    description: "A virtual location"
    required: ["value"]
    properties: {
      value: schema.#String & {
        description: "The virtual location, typically a URI"
      }
    }
  }
}