# "Library" for converting espeak output phonemes to a viseme number
# to cause lips to move.
# Author: David A. Gent (June 2014)


# First a hash of the 22 mouth shapes from
# http://wolfpaulus.com/jounal/software/lipsynchronization/
# (This is a reduced, primative english phoneme set for the value hash).  

%viseme22 = (
            0 => ["silence"] ,
            1 => ["ae", "ax", "ah"],
            2 => ["aa"],
            3 => ["ao"],
            4 => ["ey","eh", "uh"],
            5 => ["er"],
            6 => ["y", "iy", "ih", "ix"],
            7 => ["w", "uw"],
            8 => ["ow"],
            9 => ["aw"],
            10 => ["oy"],
            11 => ["ay"],
            12 => ["h"],
            13 => ["r"],
            14 => ["l"],
            15 => ["s", "z"],
            16 => ["sh", "ch", "jh", "zh"],
            17 => ["th", "dh"],
            18 => ["f", "v"],
            19 => ["d", "t", "n"],
            20 => ["k", "g", "ng"],
            21 => ["p", "b", "m"],
);

# Preston Blair phoneme series -- taken to match the shapes @
# http://www.garycmartin.com/mouth_shapes.html

%viseme10 = (
            # rest
            0 => ["silence"] ,
            # a_i
            1 => ["aa", "ay", "ae", "ax", "ah", "aw", "eh", "iy", "ey"],
            # c_d_g_k_n_r_s_th_y_z
            2 => ["r", "s", "z", "ch",
                    "zh", "d", "t", "n", "h", "k", "g", "ng"],
            # e
            3 => ["er", "ih", "y", "uh"],
            # f_v_d_th
            4 => ["f", "v"],
            # l_d_th
            5 => ["th", "dh", "l"],
            # m_b_p
            6 => ["p", "b", "m"],
            # o
            7 => ["oy", "ao", "ow"],
            # u
            8 => ["sh", "jh"],
            # w
            9 => ["w", "uw"],
);

# English (US) Consonants and vowels from
# http://espeak.sourceforge.net/phonemes.html and the corresponding
# reduced, primative english values (this is my best guess).

%espeak_phoneme = (
             # Consonants
            'p' => 'p',
            't' => 't',
            'tS' => 'ch',
            'k' => 'k',
            'f' => 'f',
            'T' => 'th',
            's' => 's',
            'S' => 'sh',
            'h' => 'h',
            'm' => 'm',
            'N' => 'ng',
            'l' => 'l',
            'j' => 'y',
            'b' => 'b',
            'd' => 'd',
            'dZ' => 'jh',
            'g' => 'g',
            'v' => 'v',
            'D' => 'th',
            'z' => 'z',
            'Z' => 'zh',
            'n' => 'n',
            'r' => 'r',
            'w' => 'w',
             # Vowels
            '@' => 'uh',
            '3' => 'er',
            '3:' => 'er',
            '@L' => 'l',
            '@2' => 'uh',  #!! who knows!
            '@5' => 'iy',  #!!
            'a' => 'aa',
            'aa' => 'aa',
            'a#' => 'aa',
            'A:' => 'aa',
            'A@' => 'aa',
            'E' => 'eh',
            'e@' => 'er', #!!
            'I' => 'ih',
            'I2' => 'ih',
            'i' => 'iy',
            'i:' => 'iy',
            'i@' => 'iy',
            '0' => 'ah',
            'V' => 'uh',
            'u:' => 'uw',
            'U' => 'uw', #!!
            'U@' => 'uw', #!!
            'O:' => 'ah',
            'O@' => 'ao', #!!
            'o@' => 'ao',
            'aI' => 'ae',
            'eI' => 'ey',
            'OI' => 'oy',
            'aU' => 'ow',
            'oU' => 'ow',
            'aI@' => 'ay',
            'aU@' => 'er',
);

# The above data structures are ridiculous to use, but are there for
# readablity, editability, and history.  We really want a hash for:
# phoneme => viseme This function creates that -- call with primative
# viseme hash and the phoneme as arguments
sub mk_phoneme_viseme_hash {
    my %newhash = ();
    my ($viseme, $phoneme ) = @_;
    foreach my $pkey (keys %{$phoneme} ) {
        my $pval = ${$phoneme}{$pkey};
        foreach my $vkey (keys %{$viseme} ) {
             # check through the array of phoneme primatives
            my $varray = ${$viseme}{$vkey};
            foreach my $vval (@$varray) {
                if ($pval =~ /^$vval$/) {
                    $newhash{$pkey} = $vkey;
                    #print "## $pkey => $vkey\n";
                }
            }
        }
    }
    return \%newhash;
}




